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
        
        // [Authorize]
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
        
    }  
}
