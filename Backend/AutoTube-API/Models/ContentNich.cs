using System;
using System.Collections.Generic;

namespace Autotube.Models;

public partial class ContentNich
{
    public int Id { get; set; }

    public string NicheName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
