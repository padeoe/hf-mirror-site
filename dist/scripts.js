function searchModel() {
    const keyword = document.getElementById('searchKeyword').value.trim();
    if (keyword) {
        const domain = window.location.hostname;
        const url = `https://${domain}/models?search=${encodeURIComponent(keyword)}`;
        window.location.href = url;
    }
}

let isDropdownNavigationActive = false;
document.getElementById('searchKeyword').addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault(); // Prevent the default Enter key behavior
        if (!isDropdownNavigationActive) {
            searchModel(); // Only call searchModel if not navigating dropdown
        } else {
            // Logic to trigger a click on the highlighted dropdown item
            // You will need to keep track of which item is currently highlighted
            // and programmatically click it.
            // Example:
            // document.querySelector('.search-result-item.highlighted').click();
            const items = document.querySelectorAll('.search-result-item');
            if (selectedIndex > -1) {
                items[selectedIndex].click();
            }
        }
        isDropdownNavigationActive = false; // Reset the flag after action
    }
});
let debounceTimer;
const searchInput = document.getElementById('searchKeyword');
const searchResults = document.getElementById('searchResults');
let abortController; // variable to hold the abort controller

searchInput.addEventListener('input', function () {
    selectedIndex = -1;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async function () {
        const query = searchInput.value.trim();
        if (query) {
            // cancel the previous request
            if (abortController) {
                abortController.abort();
            }

            // create a new abort controller
            abortController = new AbortController();
            sessionStorage.setItem('searchKeyword', query);
            try {
                const response = await fetch(`https://hf-mirror.com/api/quicksearch?q=${encodeURIComponent(query)}&type=model&type=dataset`, { signal: abortController.signal });
                const data = await response.json();
                let resultsHtml = '';
                ['models', 'datasets'].forEach(type => {
                    if (data[type]) {
                        resultsHtml += `<div><strong>${type}</strong></div>`;
                        data[type].forEach(item => {
                            resultsHtml += `<div class="search-result-item" onclick="openLink('/${type === 'models' ? '' : type + '/'}${item.id}')">${item.id}</div>`;
                        });
                    }
                });
                searchResults.innerHTML = resultsHtml;
                searchResults.style.display = 'block';
                // sessionStorage.setItem('searchResults', searchResults.innerHTML);
            } catch (error) {
                if (error.name === 'AbortError') {
                    // request was aborted, do nothing
                } else {
                    // handle other errors
                    console.error(error);
                }
            }
        } else {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
        }
    }, 300);
});

searchInput.addEventListener('focus', function () {
    if (searchInput.value.trim()) {
        searchResults.style.display = 'block';
    }
});

searchInput.addEventListener('blur', function () {
    setTimeout(function () {
        searchResults.style.display = 'none';
    }, 300);
});

function openLink(url) {
    // const itemId = url.split('/').pop();
    // searchInput.value = itemId; // update the search input value
    window.location.href = url;
}

function copyCode(btn) {
    const code = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy';
        }, 2000);
    });
}



document.addEventListener("DOMContentLoaded", function () {
    const donateArea = document.querySelector('.donate');
    const qrcode = document.querySelector('.qrcode');

    // Detect if the user is on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // On mobile, show QR code on click
        donateArea.addEventListener('click', function () {
            qrcode.classList.toggle('show-qrcode');
        });
    } else {
        // On PC, show QR code on hover is handled by CSS
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const donateArea = document.querySelector('.groups');
    const qrcode = document.querySelector('.groups_qrcode');

    // Detect if the user is on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // On mobile, show QR code on click
        donateArea.addEventListener('click', function () {
            qrcode.classList.toggle('show-qrcode');
        });
    } else {
        // On PC, show QR code on hover is handled by CSS
    }
});

let selectedIndex = -1; // variable to keep track of the selected item index

searchInput.addEventListener('keydown', function (event) {
    const items = document.querySelectorAll('.search-result-item');
    if (event.key === 'ArrowDown') {
        isDropdownNavigationActive = true;
        // down arrow key
        if (selectedIndex < items.length - 1) {
            selectedIndex++;
            items[selectedIndex].classList.add('selected');
            if (selectedIndex > 0) {
                items[selectedIndex - 1].classList.remove('selected');
            }
        }
    } else if (event.key === 'ArrowUp') {
        isDropdownNavigationActive = true;
        // up arrow key
        if (selectedIndex > 0) {
            selectedIndex--;
            items[selectedIndex].classList.add('selected');
            items[selectedIndex + 1].classList.remove('selected');
        }
    } else if (event.key === 'Enter') {
        // enter key
        if (selectedIndex > -1) {
            items[selectedIndex].click();
        }
    }
});


window.addEventListener('pageshow', function () {
    const storedKeyword = sessionStorage.getItem('searchKeyword');
    if (storedKeyword !== null) {
        // searchInput.focus();
        searchInput.value = storedKeyword;
        // const storedResults = sessionStorage.getItem('searchResults');
        // if (storedResults) {
        //     searchResults.innerHTML = storedResults;
        //     searchResults.style.display = 'block';
        // }
    }
});
// 定义一个配置对象
const config = {
    models: {
        url: "https://hf-mirror.com/models-json?p=1&sort=trending",
        containerSelector: '.models ul',
        itemTemplate: (item) => `
            <span class="model-id">${item.id}</span>
            <div class="model-info">
                <img src="path_to_downloads_icon.png" alt="下载量"> 
                <span class="model-downloads">${item.downloads}</span>
                <img src="path_to_likes_icon.png" alt="收藏量"> 
                <span class="model-likes">${item.likes}</span>
            </div>
        `
    },
    datasets: {
        // url: "https://hf-mirror.com/datasets-json?p=1&sort=trending",
        // containerSelector: '.dataset ul',
        // itemTemplate: (item) => `
        //     <span class="dataset-id">${item.id}</span>
        //     <div class="dataset-info">
        //         <img src="path_to_downloads_icon.png" alt="下载量"> 
        //         <span class="model-downloads">${item.downloads}</span>
        //         <img src="path_to_likes_icon.png" alt="收藏量"> 
        //         <span class="model-likes">${item.likes}</span>
        //     </div>
        // `

        //临时
        url: "https://hf-mirror.com/models-json?p=1&sort=trending",
        containerSelector: '.dataset ul',
        itemTemplate: (item) => `
            <span class="model-id">${item.id}</span>
            <div class="model-info">
                <img src="path_to_downloads_icon.png" alt="下载量"> 
                <span class="model-downloads">${item.downloads}</span>
                <img src="path_to_likes_icon.png" alt="收藏量"> 
                <span class="model-likes">${item.likes}</span>
            </div>
        `
    }
};

// 封装获取和渲染列表的函数
function fetchAndRenderList({ url, containerSelector, itemTemplate }) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("data is")
            console.log(data)
            const items = data["models"]; // 获取数组（models或datasets）
            console.log("items is")
            console.log(items)
            if (!items || !Array.isArray(items)) {
                throw new Error('Invalid data format');
            }
            const container = document.querySelector(containerSelector);
            if (!container) {
                throw new Error('List container element not found');
            }
            container.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = itemTemplate(item);
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // 处理错误
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // 使用封装的函数
    fetchAndRenderList(config.models);
    fetchAndRenderList(config.datasets);
});
