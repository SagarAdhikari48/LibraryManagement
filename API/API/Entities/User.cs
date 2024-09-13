namespace API.Entities;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }
    public UserType UserType { get; set; } = UserType.NONE;
    public AccountStatus AccountStatus { get; set; } = AccountStatus.UNAPPROVED;
}

public enum UserType
{
    NONE, STUDENT, ADMIN
}

public enum AccountStatus
{
    UNAPPROVED, ACTIVE, BLOCKED
}

public class BookCategory
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
}

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public float Price { get; set; }
    public bool Ordered { get; set; }
    public int BookCategoryId { get; set; }
    public BookCategory? BookCategory { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public User? User { get; set; }
    public Book? Book { get; set; }
    public DateTime OrderedDate { get; set; }
    public bool Returned { get; set; }
    public DateTime? ReturnedDate { get; set; }
    public int FinePaid { get; set; }
    
}

public class GoogleLoginDTO
{
    public string IdToken { get; set; }
}