$(".toggle-checkbox").click(function(){
    if(localStorage.getItem('theme') == 'dark')
    {
        localStorage.setItem("theme","light");
    }
    if(localStorage.getItem('theme') == 'light')
    {
        localStorage.setItem("theme","dark"); 
    }
    
  
  });