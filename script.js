const apiKey = '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';

//on load, make generate more button hidden
hideGenerateMore();

const ImgCount = 4; // Number of images to be displayed
let selectedImageNumber = null; // Number of the image selected by the user

//Generate a random number between min and max values
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Disable the generate button during the process
function disableGenerate() {
  document.getElementById('generate').disabled = true;
}

//Enable the generate button after the process
function enableGenerate() {
  document.getElementById('generate').disabled = false;
}

//Clear Image Grid
function clearImageGrid() {
  const imageGrid = document.getElementById('image-grid');
  imageGrid.innerHTML = '';
  hideGenerateMore();
}

async function generateImages(input) {
  console.log('generateImages function called');
  disableGenerate();
  clearImageGrid();

  const loading = document.getElementById('loading');
  loading.style.display = 'block';

  const imageUrls = [];

  for (let i = 0; i < ImgCount; i++) {
    const randomNumber = getRandomNumber(1, 10000);
    const prompt = `${input} ${randomNumber}`;
    const response = await fetch(
      'https://api-inference.huggingface.co/models/prompthero/openjourney',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      alert('Cannot Generate Image.');
    }

    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    imageUrls.push(imgUrl);

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = `art-${i + 1}`;
    img.onclick = () => downloadImage(imgUrl, i);
    document.getElementById('image-grid').appendChild(img);
  }

  loading.style.display = 'none';
  enableGenerate();
  showGenerateMore();

  selectedImageNumber = null;
}

document.getElementById('generate').addEventListener('click', () => {
  const input = document.getElementById('user-prompt').value;
  generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
  const link = document.createElement('a');
  link.href = imgUrl;
  link.download = `image-${imageNumber + 1}.jpg`;
  link.click();
}

// function to hide generate more button before generate button is pressed
function hideGenerateMore() {
  document.getElementById('generate-more').style.display = 'none';
}

// function to show generate more button after generate button is pressed
function showGenerateMore() {
  document.getElementById('generate-more').style.display = 'block';
}

// generate more function: on btn click, generate more images without clearing the previous ones
document.getElementById('generate-more').addEventListener('click', () => {
  const input = document.getElementById('user-prompt').value;
  generateImages(input);
});
