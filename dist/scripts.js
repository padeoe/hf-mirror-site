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

function search(){
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
                        resultsHtml += `<div class="search-result-type"><strong>${type}</strong></div>`;
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
}
searchInput.addEventListener('input', function () {
    search();
});


searchInput.addEventListener('focus', function () {
    if (searchInput.value.trim()) {
        search();
        // searchResults.style.display = 'block';
    }
});

searchInput.addEventListener('blur', function () {
    setTimeout(function () {
        searchResults.style.display = 'none';
    }, 200000);
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
    if (sessionStorage.getItem('isExpanded')){
        isExpanded = sessionStorage.getItem('isExpanded') === 'true';
    }
    else {
        isExpanded = screenWidth >= 650;
        sessionStorage.setItem('isExpanded', isExpanded);
    }


    async function fetchTrending(type) {
        let data = sessionStorage.getItem(`rankingList_${type}`);
        let expiry = sessionStorage.getItem(`expiry_ranking`);
        const now = new Date().getTime();

        if (!data || !expiry || now >= expiry) {
            const response = await fetch(`https://hf-mirror.com/api/trending?limit=10&type=${type}`);
            data = await response.json();
            expiry = new Date().getTime() + 1 * 60 * 1000;
            sessionStorage.setItem(`rankingList_${type}`, JSON.stringify(data));
            sessionStorage.setItem(`expiry_ranking`, expiry);
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

        maxItemsToShow = screenWidth > 650 ? 10: 3;
        items.forEach((item, index) => {
            const element = createTrendingItemElement(item, index);
            container.appendChild(element);
        });

        updateToggleButton();
    }

    function createTrendingItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'trending-item';
        if (index >= maxItemsToShow && !isExpanded) {
            element.classList.add('hidden-item');
        }
        element.innerHTML = getTrendingItemHTML(item, index);
        return element;
    }

    function getTrendingItemHTML(item, index) {
        const repoId = item.repoData.id;
        const repoLink = item.repoType === 'model' ? repoId : `/${item.repoType}s/${repoId}`;
        const pipeline_tag = item.repoData.pipeline_tag;
        const pipelineTagHTML = pipeline_tag ? `<a class="pipeline-tag" href="/models?pipeline_tag=${pipeline_tag}">${pipeline_tag}</a>` : '';
        const downloadCountHTML = item.repoData.downloads ? `<span class="count">${abbreviateNumber(item.repoData.downloads)}</span>` : `<span class="count">-</span>`;
        let logoHTML;
        switch (item.repoType) {
            case 'model':
                logoHTML = `<img class="model-logo" src="${item.repoData.authorData.avatarUrl}" alt="${item.repoData.author}" title="${item.repoData.authorData.fullname}">`;
                break;
            case 'dataset':
                logoHTML = `<svg class="model-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25"><ellipse cx="12.5" cy="5" fill="currentColor" fill-opacity="0.25" rx="7.5" ry="2"></ellipse><path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path><path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path><path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path></svg>`;
                break;
            case 'space':
                logoHTML = `<img class="model-logo" src="${item.repoData.authorData.avatarUrl}" alt="${item.repoData.author}">`;
                break;
            default:
                console.log('BUG');
        }
        return `
            <div class="repo-content">
                <div class="item-rank">#${index + 1}</div>
                ${logoHTML}
                <div class="item-info">
                    <a class= "repo-link" href="${repoLink}">
                        <div class="model-name">${repoId}</div>
                    </a>
                    <div class="stats-line">
                        ${pipelineTagHTML}
                        <div class="other-stats">
                            <div class="stats-detail">
                                <span>${timeAgo(item.repoData.lastModified)}</span>
                            </div>
                            <div class="stats-icons">
                                <span class="downloads">
                                    <span class="svg-placeholder"><svg class="flex-none w-3 text-gray-400 mr-0.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path></svg></span>
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
            <div>
        `;
    }

    let lastScrollPosition = 0;
    function updateToggleButton() {
        const toggleButton = document.getElementById('toggleButton');
        if (!isExpanded) {
            window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' });
        }
        toggleButton.classList.toggle('hidden', isExpanded);
        toggleButton.innerText = isExpanded ? '收起' : '展开';
        if (isExpanded) {
            lastScrollPosition = window.scrollY;
        }
    }

    document.getElementById('toggleButton').addEventListener('click', toggleVisibility);
    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', handleTabClick));


    const tabs = document.querySelectorAll('.tab');
    const savedTabType = sessionStorage.getItem('activeTabType');
    if (savedTabType) {
        tabs.forEach(tab => {
            if (tab.getAttribute('data-type') === savedTabType) {
                tab.click();
            }
        });
    }
    else if (tabs.length > 0) {
        tabs[0].click();
    }

    function toggleVisibility() {
        isExpanded = !isExpanded;
        sessionStorage.setItem('isExpanded', isExpanded);
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
        displayMoreButton(type);
        fetchTrending(type);
    }

    function displayMoreButton(type) {
        let moreItemsLink = document.getElementById('moreItems');
        if (type === 'all') {
            // moreItemsLink.style.display = 'none';
        } else {
            moreItemsLink.style.display = 'block';
            let href = '/' + type + 's';
            moreItemsLink.setAttribute('href', href);
        }
    }

    window.addEventListener('resize', adjustDisplayBasedOnWidth);
});

function adjustDisplayBasedOnWidth() {
    const screenWidth = window.innerWidth;

    maxItemsToShow = screenWidth > 650 ? 10: 3;
    const items = document.querySelectorAll('.trending-item');
    items.forEach((item, index) => {
        if (index < maxItemsToShow || isExpanded) {
            item.classList.remove('hidden-item');
        } else {
            item.classList.add('hidden-item');
        }
    });
    toggleButton.innerText = isExpanded ? '收起' : '展开';
}

window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('expiry_ranking', new Date().getTime());
});