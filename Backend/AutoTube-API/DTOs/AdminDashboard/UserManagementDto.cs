namespace Autotube.DTOs.ADashboardP
{
    public class UserManagementDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Plan { get; set; } = "None";
        public string Status { get; set; } = "inactive";
        public int Analyses { get; set; }
        public int Videos { get; set; }
        public string Revenue { get; set; } = "$0/mo";
    }
}
