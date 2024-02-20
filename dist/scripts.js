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
                        resultsHtml += `<div class=zsearch-result-type"><strong>${type}</strong></div>`;
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
        url: "https://hf-mirror.com/models-json?sort=trending",
        containerSelector: '.models ul',
        itemTemplate: (item) => `
            <span class="model-id">${item.id}</span>
            <div class="model-info">
                <span class="model-downloads">⬇️${item.downloads}</span>
                <span class="model-likes">❤️${item.likes}</span>
            </div>
        `
    },
    datasets: {
        url: "https://hf-mirror.com/models-json?sort=trending",
        containerSelector: '.dataset ul',
        itemTemplate: (item) => `
            <span class="model-id">${item.id}</span>
            <div class="model-info">
                <span class="model-downloads">⬇️${item.downloads}</span>
                <span class="model-likes">❤️${item.likes}</span>
            </div>
        `
    }
};

// 封装获取和渲染列表的函数，添加limit参数来限制项目数量
function fetchAndRenderList({ url, containerSelector, itemTemplate }, limit = 10) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const items = data["models"]; // 根据实际情况可能需要调整以适配数据结构
            if (!items || !Array.isArray(items)) {
                throw new Error('Invalid data format');
            }
            const container = document.querySelector(containerSelector);
            if (!container) {
                throw new Error('List container element not found');
            }
            container.innerHTML = ''; // 清空容器
            items.slice(0, limit).forEach(item => { // 只渲染前limit项
                const li = document.createElement('li');
                li.innerHTML = itemTemplate(item);
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function timeAgo(date) {
    const now = new Date();
    const updatedDate = new Date(date);
    const diffTime = Math.abs(now - updatedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 60) {
        return `${diffDays}天前更新`;
    } else {
        // 获取年、月、日，并确保月和日为两位数格式
        const year = updatedDate.getFullYear();
        let month = updatedDate.getMonth() + 1; // getMonth() 从 0 开始
        let day = updatedDate.getDate();

        // 将月份和日期格式化为两位数
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        // 组合成 YYYY-MM-DD 格式的字符串
        return `${year}-${month}-${day}更新`;
    }
}

function abbreviateNumber(num) {
    if (num >= 1000000) { // For numbers >= 1,000,000
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) { // For numbers >= 1,000
        return `${(num / 1000).toFixed(1)}k`;
    } else {
        return num; // For numbers < 1,000
    }
}
let isExpanded = false;
let maxItemsToShow = 3;

document.addEventListener('DOMContentLoaded', function () {
    const screenWidth = window.innerWidth;
    maxItemsToShow = screenWidth < 768 ? 3 : 10;
    isExpanded = screenWidth >= 768;

    async function fetchTrending(type) {
        const response = await fetch(`https://hf-mirror.com/api/trending?limit=10&type=${type}`);
        const data = await response.json();
        updateTrendingItems(data.recentlyTrending);
    }

    function updateTrendingItems(items) {
        const container = document.getElementById('trendingItems');
        container.innerHTML = '';

        items.forEach((item, index) => {
            const element = createTrendingItemElement(item, index);
            container.appendChild(element);
        });

        updateToggleButton();
    }

    function createTrendingItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'trending-item';
        console.log(`index:${index}, maxItemsToShow: ${maxItemsToShow}, isExpanded:${isExpanded}`);
        if (index >= maxItemsToShow && !isExpanded) element.classList.add('hidden-item');
        element.innerHTML = getTrendingItemHTML(item, index);
        return element;
    }

    function getTrendingItemHTML(item, index) {
        const modelName = item.repoData.id;
        const pipeline_tag = item.repoData.pipeline_tag;
        const pipelineTagHTML = pipeline_tag ? `<div class="pipeline-tag">${pipeline_tag}</div>` : '';
        const downloadCountHTML = item.repoData.downloads ? `<span class="count">${abbreviateNumber(item.repoData.downloads)}</span>` : `<span class="count">-</span>`;
        return `
            <div class="item-rank">#${index + 1}</div>
            <img src="${item.repoData.authorData.avatarUrl}" alt="${item.repoData.author}">
            <div class="item-info">
                <div class="model-name">${modelName}</div>
                <div class="stats-line">
                    ${pipelineTagHTML}
                    <div class="other-stats">
                        <div class="stats-detail">
                            <span>${timeAgo(item.repoData.lastModified)}</span>
                        </div>
                        <div class="stats-icons">
                            <span class="downloads">${downloadCountHTML}</span>
                            <span class="likes"><span class="count">${abbreviateNumber(item.likes)}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateToggleButton() {
        const toggleButton = document.getElementById('toggleButton');
        toggleButton.classList.toggle('hidden', isExpanded);
        toggleButton.innerText = isExpanded ? '折叠' : '展开全部';
    }

    document.getElementById('toggleButton').addEventListener('click', toggleVisibility);
    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', handleTabClick));

    fetchTrending('all');
    setActiveTab();

    function toggleVisibility() {
        console.log(`点击时isExpanded原本的值是${isExpanded}`);
        isExpanded = !isExpanded;
        console.log(`点击后isExpanded的值是${isExpanded}`);
        document.querySelectorAll('.trending-item').forEach((item, index) => {
            if (index >= maxItemsToShow) item.classList.toggle('hidden-item', !isExpanded);
        });
        updateToggleButton();
    }

    function handleTabClick() {
        if (this.classList.contains('active')) return;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const type = this.getAttribute('data-type');
        fetchTrending(type);
    }

    function setActiveTab() {
        const firstTab = document.querySelector('.tab');
        if (firstTab) {
            firstTab.classList.add('active');
            const type = firstTab.getAttribute('data-type');
            fetchTrending(type);
        }
    }

    window.addEventListener('resize', adjustDisplayBasedOnWidth);
});

function adjustDisplayBasedOnWidth() {
    console.log("开始调整");
    const screenWidth = window.innerWidth;

    if (screenWidth > 768) {
        maxItemsToShow = 10;
    }
    else {
        maxItemsToShow = 3;
    }
    console.log(`调整 isExpanded：${isExpanded}, maxItemsToShow: ${maxItemsToShow}`);


    const items = document.querySelectorAll('.trending-item');
    items.forEach((item, index) => {
        if (index < maxItemsToShow || isExpanded) {
            item.classList.remove('hidden-item');
        } else {
            item.classList.add('hidden-item');
        }
    });
    toggleButton.innerText = isExpanded ? '折叠' : '展开全部';
}