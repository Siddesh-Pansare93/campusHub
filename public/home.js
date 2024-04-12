// Get all interaction1 elements
const interactions1 = document.querySelectorAll('.interaction1');

// Loop through each interaction1 element
interactions1.forEach(interaction1 => {
    // Find the like and unlike buttons within each interaction1
    const likeButton = interaction1.querySelector('.button1');
    const unlikeButton = interaction1.querySelector('.button2');

    // Add click event listener to the like button within each interaction1
    likeButton.addEventListener('click', function() {
        // Change the color of the like button within the same interaction1
        this.style.backgroundColor = 'teal';
        // Reset the color of the unlike button within the same interaction1
        unlikeButton.style.backgroundColor = '';
    });

    // Add click event listener to the unlike button within each interaction1
    unlikeButton.addEventListener('click', function() {
        // Change the color of the unlike button within the same interaction1
        this.style.backgroundColor = 'darkslategrey';
        // Reset the color of the like button within the same interaction1
        likeButton.style.backgroundColor = '';
    });
});


function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  var icon = document.getElementById("dropdownIcon");
  icon.addEventListener("click", function() {
      document.getElementById("myDropdown").classList.toggle("show");
  });
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('#dropdownIcon')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}