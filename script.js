document.addEventListener("DOMContentLoaded", () => {
  // ====== DOM ELEMENTS ======
  const carousel = document.getElementById("memory-carousel");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const uploadButton = document.getElementById("upload-button");
  const imageInput = document.getElementById("image-input");
  const deletePopup = document.getElementById("delete-popup");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const cancelDeleteBtn = document.getElementById("cancel-delete");

  // ====== STATE VARIABLES ======
  let currentIndex = 0;
  let memories = [];
  let currentMemoryToDelete = null;

  // ====== INITIAL LOAD ======
  loadMemories();

  // ====== CORE FUNCTIONS ======
  function loadMemories() {
    // 1. First load hardcoded images (your working test images)
    const defaultImages = [
      "images/1.jpg",
      "images/2.jpg",
      "images/3.jpg",
      "images/5.jpg",
      "images/6.jpg",
      "images/7.jpg",
      "images/8.jpg",
      "images/9.jpg",
      "images/10.jpg",
      "images/11.jpg",
      "images/12.jpg",
      "images/13.jpg",
      "images/14.jpg",

    ];
    
    // 2. Then load any saved uploads from localStorage
    const savedMemories = JSON.parse(localStorage.getItem('memories')) || [];
    
    // 3. Combine both (defaults + uploads)
    memories = [...defaultImages, ...savedMemories];
    
    // 4. Display all images
    carousel.innerHTML = '';
    memories.forEach((src, index) => {
      const memoryDiv = document.createElement("div");
      memoryDiv.className = "memory";
      memoryDiv.dataset.index = index;
      
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Memory";
      
      memoryDiv.appendChild(img);
      carousel.appendChild(memoryDiv);
    });
    
    updateCarouselPosition();
  }

  function updateCarouselPosition() {
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  }

  // ====== UPLOAD FUNCTIONALITY ======
  uploadButton.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if (!files.length) return;

    imageInput.value = ""; // Reset input

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert("Please upload only images (JPEG, PNG, etc.)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        // Save to localStorage
        const uploadedImages = JSON.parse(localStorage.getItem('memories')) || [];
        uploadedImages.push(event.target.result);
        localStorage.setItem('memories', JSON.stringify(uploadedImages));
        
        // Refresh display
        loadMemories();
      };
      reader.readAsDataURL(file);
    });
  });

  // ====== CAROUSEL NAVIGATION ====== 
  function moveToImage(newIndex) {
    currentIndex = newIndex;
    updateCarouselPosition();
  }

  prevBtn.addEventListener("click", () => {
    moveToImage((currentIndex - 1 + memories.length) % memories.length);
  });

  nextBtn.addEventListener("click", () => {
    moveToImage((currentIndex + 1) % memories.length);
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  });

  // ====== DELETE FUNCTIONALITY ======
  carousel.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      currentMemoryToDelete = e.target.closest(".memory");
      deletePopup.style.display = "block";
    }
  });

  confirmDeleteBtn.addEventListener("click", () => {
    if (currentMemoryToDelete) {
      const index = parseInt(currentMemoryToDelete.dataset.index);
      
      // Don't allow deleting hardcoded images (first 3)
      if (index >= 3) {
        const uploadedImages = JSON.parse(localStorage.getItem('memories')) || [];
        uploadedImages.splice(index - 3, 1); // Adjust index for uploaded images
        localStorage.setItem('memories', JSON.stringify(uploadedImages));
      }
      
      loadMemories(); // Refresh
      deletePopup.style.display = "none";
    }
  });

  cancelDeleteBtn.addEventListener("click", () => {
    deletePopup.style.display = "none";
  });
});
// ====== MUSIC PLAYER ======
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const volumeControl = document.getElementById("volumeControl");
  
  // Safety check - only run if elements exist
  if (!bgMusic || !musicToggle || !volumeControl) {
    console.error("Music elements missing!");
    return;
  }

  // Initialize with default volume
  bgMusic.volume = 0.5;
  let isPlaying = false;

  // Play/pause handler
  musicToggle.addEventListener("click", async () => {
    try {
      if (isPlaying) {
        await bgMusic.pause();
        musicToggle.textContent = "▶️ Play";
      } else {
        await bgMusic.play();
        musicToggle.textContent = "⏸️ Pause";
      }
      isPlaying = !isPlaying;
    } catch (error) {
      console.error("Playback error:", error);
      alert("Please click anywhere on the page first to enable audio");
    }
  });

  // Volume control
  volumeControl.addEventListener("input", () => {
    bgMusic.volume = volumeControl.value;
  });

  // Enable audio after first interaction
  document.body.addEventListener("click", () => {
    bgMusic.play().then(() => bgMusic.pause()); // Unlocks audio
  }, { once: true });
});
<!-- Add to memories.html before </body> -->
<div class="music-player">
  <div class="player-header">
    <div id="nowPlaying">Loading...</div>
    <div id="loadingSpinner" class="spinner"></div>
  </div>
  
  <div class="visualizer">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </div>
  
  <div class="player-controls">
    <button id="prevSong">⏮</button>
    <button id="musicToggle">▶️</button>
    <button id="nextSong">⏭</button>
    <input type="range" id="volumeControl" min="0" max="1" step="0.01" value="0.5">
    <span id="volumePercent">50%</span>
  </div>
</div>

<audio id="bgMusic"></audio>
