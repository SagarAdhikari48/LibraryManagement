using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LibraryController : ControllerBase
    {
        private readonly Context _context;
        private readonly EmailService _emailService;
        private readonly JwtService _jwtService;
        public LibraryController(Context context, EmailService emailService,JwtService jwtService)
        {
            this._context = context;
            this._emailService = emailService;
            this._jwtService = jwtService;
        }

        [HttpPost("Register")]
        public  ActionResult Register(User user)
        {
            
            user.UserType = UserType.STUDENT;
            user.AccountStatus = AccountStatus.UNAPPROVED;
            user.CreatedOn = DateTime.Now;
            _context.Users.Add(user);
            _context.SaveChanges();
            const string subject = "Account Created!";
            var body = $"""
                            <html>
                                <body>
                                    <h1>Hello, {user.FirstName} {user.LastName}</h1>
                                    <h2>
                                        Your account has been created and we have sent approval request to admin. 
                                        Once the request is approved by admin you will receive email, and you will be
                                        able to login in to your account.
                                    </h2>
                                    <h3>Thanks</h3>
                                </body>
                            </html>
                        """;
            _emailService.SendEmail(user.Email, subject, body);
            return Ok("Thank you for registering user. Your account has been sent for approval.Once it is approved you will get an email!");
            
        }

        [HttpGet("Login")]
        public ActionResult Login(string email, string password)
        {
            if (_context.Users.Any(u => u.Email.Equals(email) && u.Password.Equals(password)))
            {
                var user = _context.Users.Single(s => s.Email.Equals(email) && s.Password.Equals(password));
                
                if (user.AccountStatus == AccountStatus.UNAPPROVED)
                {
                    return Ok("Unapproved");
                }else if (user.AccountStatus == AccountStatus.BLOCKED)
                {
                    return Ok("blocked");
                }

                return Ok(_jwtService.GenerateToken(user));
            }
            return Ok("Not Found!");
        }
        
        [Authorize]
        [HttpGet("GetBooks")]
        public ActionResult GetBooks()
        {
            if (this._context.Books.Any())
            {
                return Ok(this._context.Books.Include(b=>b.BookCategory).ToList());
            }

            return NotFound();
        }

        [HttpPost("OrderBook")]
        public ActionResult OrderBook(int userId, int bookId)
        {
            var canOrder = _context.Orders.Count(o => o.UserId == userId) < 3;
            if (canOrder)
            {
                _context.Orders.Add(new()
                {
                    UserId = userId,
                    BookId = bookId,
                    OrderedDate = DateTime.Now,
                    Returned = false,
                    ReturnedDate = null,
                    FinePaid = 0
                });

                var book = _context.Books.Find(bookId);
                if (book is not null)
                {
                    book.Ordered = true;
                }
                _context.SaveChanges();
                return Ok("ordered");
            }
            return Ok("Cannot order");
        }

        [Authorize]
        [HttpGet("GetOrdersOfUser")]
        public ActionResult GetOrderOfUser(int userId)
        {
            var orders = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Book)
                .Where(o => o.UserId == userId)
                .ToList();

            if (orders.Any())
            {
                return Ok(orders);
            }
            else
            {
                return NotFound();
            }

        }

        [Authorize]
        [HttpPost("AddNewCategory")]
        public ActionResult AddNewCategory(BookCategory category)
        {
            var exists = _context.BookCategories.Any(bc =>
                bc.Category == category.Category && bc.SubCategory == category.SubCategory);
            if (exists)
            {
                return Ok("cannot insert");
            }
            else
            {
                _context.BookCategories.Add(category);
                _context.SaveChanges();
                return Ok("INSERTED");

            }
        }

        [Authorize]
        [HttpGet("GetCategories")]
        public ActionResult GetCategories()
        {
            var categories = _context.BookCategories.ToList();
            if (categories.Any())
            {
                return Ok(categories);
            }
            return NotFound();
        }

        [Authorize]
        [HttpPost("AddNewBook")]
        public ActionResult AddNewBook(Book book)
        {
            var exist = _context.Books.Any(b => b.Id == book.Id);
            if (exist)
            {
                return Ok("Books already exist!");
            }
            else
            {
                book.BookCategory = null;
                _context.Books.Add(book);
                _context.SaveChanges();
                return Ok("Inserted");
            }
        }
        
        [Authorize]
        [HttpDelete("DeleteBook")]
        public ActionResult DeleteBook(int id)
        {
            var exists = _context.Books.Any(b => b.Id == id);
            if (exists)
            {
                var book = _context.Books.Find(id);
                _context.Books.Remove(book!);
                _context.SaveChanges();
                return Ok("deleted");
            }
            else
            {
                return Ok("Not Found!");

            }
        }
        [HttpGet("ReturnBook")]
        public ActionResult ReturnBook(int userId, int bookId, int fine)
        {
            var order = _context.Orders.SingleOrDefault(o => o.UserId == userId && o.BookId == bookId);
            if(order is not null)
            {
                order.Returned = true;
                order.ReturnedDate = DateTime.Now;
                order.FinePaid = fine;
                var book = _context.Books.Single(b => b.Id == order.BookId);
                book.Ordered = false;
                _context.SaveChanges();
                return Ok("returned");
            }
            return Ok("not returned");
        }
        
        [Authorize]
        [HttpGet("GetUsers")]
        public ActionResult GetUsers()
        {
            return Ok(_context.Users.ToList());
        }

        [Authorize]
        [HttpGet("ApproveRequest")]
        public ActionResult ApproveRequest(int userId)
        {
            var user = _context.Users.Find(userId);

            if (user is not null)
            {
                if(user.AccountStatus == AccountStatus.UNAPPROVED)
                {
                    user.AccountStatus = AccountStatus.ACTIVE;
                    _context.SaveChanges();

                    _emailService.SendEmail(user.Email, "Account Approved", $"""
                                                                                <html>
                                                                                    <body>
                                                                                        <h2>Hi, {user.FirstName} {user.LastName}</h2>
                                                                                        <h3>You Account has been approved by admin.</h3>
                                                                                        <h3>Now you can login to your account.</h3>
                                                                                    </body>
                                                                                </html>
                                                                            """);

                    return Ok("approved");
                }
            }

            return Ok("not approved");
        }

        [Authorize]
        [HttpGet("GetOrders")]
        public ActionResult GetOrders()
        {
            var orders = _context.Orders.Include(o =>o.User).Include(o=>o.Book).ToList();
            if (orders.Any())
            {
                return Ok(orders);
            }

            return NotFound();
        }

        [Authorize]
        [HttpGet("SendEmailForPendingReturns")]
        public ActionResult SendEmailForPendingReturns()
        {
            var orders = _context.Orders
                            .Include(o => o.Book)
                            .Include(o => o.User)
                            .Where(o => !o.Returned)
                            .ToList();

            var emailsWithFine = orders.Where(o => DateTime.Now > o.OrderedDate.AddDays(10)).ToList();
            emailsWithFine.ForEach(x => x.FinePaid = (DateTime.Now - x.OrderedDate.AddDays(10)).Days * 50);

            var firstFineEmails = emailsWithFine.Where(x => x.FinePaid == 50).ToList();
            firstFineEmails.ForEach(x =>
            {
                var body = $"""
                <html>
                    <body>
                        <h2>Hi, {x.User?.FirstName} {x.User?.LastName}</h2>
                        <h4>Yesterday was your last day to return Book: "{x.Book?.Title}".</h4>
                        <h4>From today, every day a fine of 50Rs will be added for this book.</h4>
                        <h4>Please return it as soon as possible.</h4>
                        <h4>If your fine exceeds 500Rs, your account will be blocked.</h4>
                        <h4>Thanks</h4>
                    </body>
                </html>
                """;

                _emailService.SendEmail(x.User!.Email, "Return Overdue", body);
            });

            var regularFineEmails = emailsWithFine.Where(x => x.FinePaid > 50 && x.FinePaid <= 500).ToList();
            regularFineEmails.ForEach(x =>
            {
                var regularFineEmailsBody = $"""
                <html>
                    <body>
                        <h2>Hi, {x.User?.FirstName} {x.User?.LastName}</h2>
                        <h4>You have {x.FinePaid}Rs fine on Book: "{x.Book?.Title}"</h4>
                        <h4>Pleae pay it as soon as possible.</h4>
                        <h4>Thanks</h4>
                    </body>
                </html>
                """;

                _emailService.SendEmail(x.User?.Email!, "Fine To Pay", regularFineEmailsBody);
            });

            var overdueFineEmails = emailsWithFine.Where(x => x.FinePaid > 500).ToList();
            overdueFineEmails.ForEach(x =>
            {
                var overdueFineEmailsBody = $"""
                <html>
                    <body>
                        <h2>Hi, {x.User?.FirstName} {x.User?.LastName}</h2>
                        <h4>You have {x.FinePaid}Rs fine on Book: "{x.Book?.Title}"</h4>
                        <h4>Your account is BLOCKED.</h4>
                        <h4>Pleae pay it as soon as possible to UNBLOCK your account.</h4>
                        <h4>Thanks</h4>
                    </body>
                </html>
                """;
                _emailService.SendEmail(x.User?.Email!, "Fine Overdue", overdueFineEmailsBody);
            });
            return Ok("sent");
        }

        [Authorize]
        [HttpGet("BlockedFineOverdueUser")]
        public ActionResult BlockedFineOverdueUser()
        {
            var orders = _context.Orders
                .Include(o => o.User)
                .Include(o => o.Book)
                .Where(o => !o.Returned)
                .ToList();

            var orderWithFine = orders.Where(o => DateTime.Now > o.OrderedDate.AddDays(10)).ToList();
            orderWithFine.ForEach(of =>of.FinePaid = (DateTime.Now - of.OrderedDate.AddDays(10)).Days * 50);
            var users = orderWithFine.Where(owf => owf.FinePaid > 500).Select(x=>x.User).Distinct().ToList();
            if (users is not null && users.Any())
            {
                users.ForEach(user => user.AccountStatus = AccountStatus.BLOCKED);
                _context.SaveChanges();
                return Ok("blocked");
            }
            else
            {
                return Ok("not blocked");
            }

        }

        [Authorize]
        [HttpGet("Unblock")]
        public ActionResult Unblock(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user is not null)
            {
                user.AccountStatus = AccountStatus.ACTIVE;
                _context.SaveChanges();
                return Ok("unblocked");
            }
            return Ok("not unblocked");
        }
    }  
}
