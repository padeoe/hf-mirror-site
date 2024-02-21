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
    }, 3000);
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
        let data = localStorage.getItem(`rankingList_${type}`);
        let expiry = localStorage.getItem(`expiry_ranking`);
        const now = new Date().getTime();

        if (!data || !expiry || now >= expiry) {
            const response = await fetch(`https://hf-mirror.com/api/trending?limit=10&type=${type}`);
            data = await response.json();
            expiry = new Date().getTime() + 3600 * 1000;
            localStorage.setItem(`rankingList_${type}`, JSON.stringify(data));
            localStorage.setItem(`expiry_ranking`, expiry);
        }
        else {
            data = JSON.parse(data);
        }
        const filteredData = data.recentlyTrending.filter(item => item.repoType !== 'space');
        lastScrollPosition = 0;
        updateTrendingItems(filteredData.slice(0, 10));
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
        if (index >= maxItemsToShow && !isExpanded) element.classList.add('hidden-item');
        element.innerHTML = getTrendingItemHTML(item, index);
        return element;
    }

    function getTrendingItemHTML(item, index) {
        const repoId = item.repoData.id;
        const repoLink = item.repoType === 'model' ? repoId : `/${item.repoType}s/${repoId}`;
        const pipeline_tag = item.repoData.pipeline_tag;
        const pipelineTagHTML = pipeline_tag ? `<div class="pipeline-tag">${pipeline_tag}</div>` : '';
        const downloadCountHTML = item.repoData.downloads ? `<span class="count">${abbreviateNumber(item.repoData.downloads)}</span>` : `<span class="count">-</span>`;
        let logoHTML;
        switch (item.repoType) {
            case 'model':
                logoHTML = `<img class="model-logo" src="${item.repoData.authorData.avatarUrl}" alt="${item.repoData.author}">`;
                break;
            case 'dataset':
                logoHTML = `<svg class="model-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25"><ellipse cx="12.5" cy="5" fill="currentColor" fill-opacity="0.25" rx="7.5" ry="2"></ellipse><path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path><path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path><path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path></svg>`;
                break;
            case 'space':
                logoHTML = `<img class="model-logo" src="${item.repoData.authorData.avatarUrl}" alt="${item.repoData.author}">`;
                // logoHTML = `<svg class="model-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M7.80914 18.7462V24.1907H13.2536V18.7462H7.80914Z" fill="#FF3270"></path><path d="M18.7458 18.7462V24.1907H24.1903V18.7462H18.7458Z" fill="#861FFF"></path><path d="M7.80914 7.80982V13.2543H13.2536V7.80982H7.80914Z" fill="#097EFF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4 6.41775C4 5.08246 5.08246 4 6.41775 4H14.6457C15.7626 4 16.7026 4.75724 16.9802 5.78629C18.1505 4.67902 19.7302 4 21.4685 4C25.0758 4 28.0003 6.92436 28.0003 10.5317C28.0003 12.27 27.3212 13.8497 26.2139 15.02C27.243 15.2977 28.0003 16.2376 28.0003 17.3545V25.5824C28.0003 26.9177 26.9177 28.0003 25.5824 28.0003H17.0635H14.9367H6.41775C5.08246 28.0003 4 26.9177 4 25.5824V15.1587V14.9367V6.41775ZM7.80952 7.80952V13.254H13.254V7.80952H7.80952ZM7.80952 24.1907V18.7462H13.254V24.1907H7.80952ZM18.7462 24.1907V18.7462H24.1907V24.1907H18.7462ZM18.7462 10.5317C18.7462 9.0283 19.9651 7.80952 21.4685 7.80952C22.9719 7.80952 24.1907 9.0283 24.1907 10.5317C24.1907 12.0352 22.9719 13.254 21.4685 13.254C19.9651 13.254 18.7462 12.0352 18.7462 10.5317Z" fill="black"></path><path d="M21.4681 7.80982C19.9647 7.80982 18.7458 9.02861 18.7458 10.5321C18.7458 12.0355 19.9647 13.2543 21.4681 13.2543C22.9715 13.2543 24.1903 12.0355 24.1903 10.5321C24.1903 9.02861 22.9715 7.80982 21.4681 7.80982Z" fill="#FFD702"></path></svg>`
                // logoHTML = `<svg src="${item.repoData.authorData.avatarUrl}" alt="${item.repoData.author}">`;
                break;
            default:
                console.log('BUG');
        }
        return `
            <a class= "repo-link" href="${repoLink}">
                <div class="item-rank">#${index + 1}</div>
                ${logoHTML}
                <div class="item-info">
                    <div class="model-name">${repoId}</div>
                    <div class="stats-line">
                        ${pipelineTagHTML}
                        <div class="other-stats">
                            <div class="stats-detail">
                                <span>${timeAgo(item.repoData.lastModified)}</span>
                            </div>
                            <div class="stats-icons">
                                <span class="downloads">
                                    <span class="svg-placeholder"><svg class="flex-none w-3 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" fill="currentColor"><path d="M22.45,6a5.47,5.47,0,0,1,3.91,1.64,5.7,5.7,0,0,1,0,8L16,26.13,5.64,15.64a5.7,5.7,0,0,1,0-8,5.48,5.48,0,0,1,7.82,0L16,10.24l2.53-2.58A5.44,5.44,0,0,1,22.45,6m0-2a7.47,7.47,0,0,0-5.34,2.24L16,7.36,14.89,6.24a7.49,7.49,0,0,0-10.68,0,7.72,7.72,0,0,0,0,10.82L16,29,27.79,17.06a7.72,7.72,0,0,0,0-10.82A7.49,7.49,0,0,0,22.45,4Z"></path></svg></span>
                                    <span class="count">${downloadCountHTML}</span>
                                </span>
                                <span class="likes">
                                    <span class="svg-placeholder"><svg class="flex-none w-3 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" fill="currentColor"><path d="M22.45,6a5.47,5.47,0,0,1,3.91,1.64,5.7,5.7,0,0,1,0,8L16,26.13,5.64,15.64a5.7,5.7,0,0,1,0-8,5.48,5.48,0,0,1,7.82,0L16,10.24l2.53-2.58A5.44,5.44,0,0,1,22.45,6m0-2a7.47,7.47,0,0,0-5.34,2.24L16,7.36,14.89,6.24a7.49,7.49,0,0,0-10.68,0,7.72,7.72,0,0,0,0,10.82L16,29,27.79,17.06a7.72,7.72,0,0,0,0-10.82A7.49,7.49,0,0,0,22.45,4Z"></path></svg></span>
                                    <span class="count">${abbreviateNumber(item.likes)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    let lastScrollPosition = 0;
    function updateToggleButton() {
        const toggleButton = document.getElementById('toggleButton');
        if (!isExpanded) {
            window.scrollTo({ top: lastScrollPosition, behavior: 'auto' });
        }
        toggleButton.classList.toggle('hidden', isExpanded);
        toggleButton.innerText = isExpanded ? '收起': '展开全部';
        if (isExpanded) {
            lastScrollPosition = window.scrollY;
        }
    }

    document.getElementById('toggleButton').addEventListener('click', toggleVisibility);
    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', handleTabClick));


    fetchTrending('all');
    setActiveTab();

    function toggleVisibility() {
        isExpanded = !isExpanded;
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
        // 使用sessionStorage保存当前激活的tab的data-type
        sessionStorage.setItem('activeTabType', type);
        fetchTrending(type);
    }

    function setActiveTab() {
        // 从sessionStorage中获取保存的tab的data-type
        const savedTabType = sessionStorage.getItem('activeTabType');
        const tabs = document.querySelectorAll('.tab');
        if (savedTabType) {
            tabs.forEach(tab => {
                if (tab.getAttribute('data-type') === savedTabType) {
                    tab.classList.add('active');
                }
            });
        } else if (tabs.length > 0) {
            // 如果没有保存的tab，激活第一个tab
            tabs[0].classList.add('active');
        }
    }

    window.addEventListener('resize', adjustDisplayBasedOnWidth);
});

function adjustDisplayBasedOnWidth() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 768) {
        maxItemsToShow = 10;
    }
    else {
        maxItemsToShow = 3;
    }

    const items = document.querySelectorAll('.trending-item');
    items.forEach((item, index) => {
        if (index < maxItemsToShow || isExpanded) {
            item.classList.remove('hidden-item');
        } else {
            item.classList.add('hidden-item');
        }
    });
    toggleButton.innerText = isExpanded ? '收起' : '展开全部';
}

window.addEventListener('beforeunload', function () {
    localStorage.setItem('expiry_ranking', new Date().getTime());
});