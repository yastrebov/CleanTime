using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CleanTime.Controllers
{
    public class CleaningTypesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ViewType()
        {
            return View();
        }
    }
}