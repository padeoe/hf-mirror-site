var url = "https://hf-mirror.com/models-json?p=1&sort=trending"
var tempurl = "https://baidu.com"

console.log("方法前的日志");

document.addEventListener('DOMContentLoaded', function () {
    console.log("方法日志1")

    // 发起 HTTP 请求以获取数据
    // fetch(url, {
    //     method: 'GET',
    //     headers: {
    //         'authority': 'hf-mirror.com',
    //         'accept': '*/*',
    //         'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    //         // 注意：在实际应用中，通常不应直接在代码中硬编码 cookies，特别是在客户端代码中
    //         'cookie': '__stripe_mid=6ee3e0e5-7342-4196-9def-2dc1fdd22d8cf951eb; _ga_8Q63TH4CSL=GS1.1.1687418523.2.1.1687418706.0.0.0; _ga=GA1.1.72451070.1687351281; __stripe_sid=133414a9-ebff-412c-9e50-54ab4cce4009f9ab49; aws-waf-token=82473410-2733-4b11-a717-62e347243e13:AAoAaVUXvPkJAAAA:ay3rMpnjaEh2p4W36IZjjSm7jDVwNa8UCdX6IWlImFfGy1pipbB33D+bepw2L49eGlGUKZuwpwSddgHHn+i+HVfX0YzOQok7euvxDDgWiXxExgOQfBFn/Xu7eMmLluQUyL2QRju1I+ermf16RCVphrREHqhhVDY3Srt29UHFwd2Ip2/xl5NkOuH7TGWsX8fW8N7qHGL/uAgZXTxGUUWkqkwLY9KHLaRWQA0fGIDydZRMsETu6CUc',
    //         'referer': 'https://hf-mirror.com/models?p=1&sort=trending',
    //         'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    //         'sec-ch-ua-mobile': '?0',
    //         'sec-ch-ua-platform': '"Windows"',
    //         'sec-fetch-dest': 'empty',
    //         'sec-fetch-mode': 'cors',
    //         'sec-fetch-site': 'same-origin',
    //         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    //     }
    // })
    // .then(response => {
    //     console.log(response.json())
    //     return response.json();
    // })
    // .then(data => {
    //     console.log("12312")
    //     // 确保数据中包含 models 数组
    //     if (!data.models || !Array.isArray(data.models)) {
    //         throw new Error('Invalid data format');
    //     }

    //     // 获取 HTML 中的对应元素
    //     const modelsUl = document.querySelector('.category.models ul');

    //     // 检查元素是否存在
    //     if (!modelsUl) {
    //         throw new Error('Models list element not found in the HTML');
    //     }

    //     // 清空原有的列表项
    //     modelsUl.innerHTML = '';

    //     // 遍历 models 数组，并更新列表
    //     data.models.forEach(model => {
    //         const li = document.createElement('li');
    //         li.textContent = `Model ID: ${model.id}`; // 使用模板字符串
    //         modelsUl.appendChild(li);
    //     });
    // })
    // .catch(error => {
    //     console.log("error")
    //     console.error('Error:', error);
    //     // 可以在这里处理错误，例如在页面上显示错误信息
    // });
});

console.log("222");