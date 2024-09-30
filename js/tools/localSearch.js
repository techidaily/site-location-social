export default function initLocalSearch() {
  // Host
  const hostname = config.hostname;

  // Popup Window
  let isfetched = false;
  let currentPage = 1;
  let lastSearchText = '';
  
  const inFetchingHTML = '<div id="no-result"><i class="fa-solid fa-spinner fa-spin-pulse fa-5x fa-fw"></i></div>';
  const noResultHTML = '<div id="no-result"><i class="fa-solid fa-box-open fa-5x"></i></div>';
  
  const searchInputDom = document.querySelector(".search-input");
  const resultContent = document.getElementById("search-result");
  
  const updateFetchingState = () => {
    resultContent.innerHTML = inFetchingHTML;
    window.pjax && window.pjax.refresh(resultContent);    
  }

  const removeFetchingState = () => {
    // Remove loading animation
    const noResultDom = document.querySelector("#no-result");
    noResultDom &&
      (noResultDom.innerHTML =
        '<i class="fa-solid fa-magnifying-glass fa-5x"></i>');
  }
  
  const resetInitState = () => {
    resultContent.innerHTML = noResultHTML;
    removeFetchingState();
    window.pjax && window.pjax.refresh(resultContent); 
  }
  
  const renderPaginationButtons = (pageNumbers) => {
    const paginationContainer = document.createElement('div');
    const paginationButtons = [];
    
    pageNumbers.forEach(num => {
      const button = document.createElement('button');
      button.textContent = num;
      button.classList.add('pagination-button');
      if (num === currentPage) {
        ['active','font-bold', 'text-sky-500'].forEach(c => {
          button.classList.add(c);  
        }) 
      }
      paginationButtons.push(button);
    })

    paginationContainer.innerHTML = '';
    ['flex','items-center','justify-center','space-x-4','py-3', 'fixed', 'bottom-0', 'left-1/2', '-translate-x-1/2'].forEach(c => {
      paginationContainer.classList.add(c);  
    })
    paginationButtons.forEach((button) => {
      paginationContainer.appendChild(button);
    }); 
    
    paginationContainer.addEventListener('click', handlePaginationButtonClick);   
    return paginationContainer;
  }
  
  const highlightedText = (text, keywords) => {
    return text.replace(new RegExp(keywords.join('|'), 'gi'), (match) => `<span style="background-color: yellow;">${match}</span>`);
  }
  
  const onFetchData = (res) => {
    let resultItems = [];
    // console.log(`data from remote:`);
    // console.log(res);
    
    const dataList = res?.data || [];
    const totalPages = res?.pagination?.totalPages || 0;
    const curPage = res?.pagination?.page || 0;
    
    dataList.forEach(({ url,  title}) => {      
      const li = document.createElement('li');
      const a = document.createElement('a');
      
      a.href = url;
      a.classList.add('search-result-title');
      // a.textContent = title;
      a.innerHTML = highlightedText(title, [lastSearchText]);
      li.appendChild(a);
      
      // 添加到记录中
      resultItems.push(li);                   
    });
    
    if (dataList.length > 0) {
      const container = document.createElement('div');
      container.classList.add('search-result-list');
      
      const ul = document.createElement('ul');
      resultItems.forEach((li) => {
        ul.appendChild(li);
      });
      
      const pageNumbers = [];
      const maxButtons = 9; // 最多显示的按钮数
      const startPageNum = Math.max(1, currentPage - Math.floor(maxButtons/2));
      const endPageNum = Math.min(totalPages, startPageNum + maxButtons - 1);
      for(let i = startPageNum; i <= endPageNum; i++) {
        pageNumbers.push(i);
      }
      const paginationContainer = renderPaginationButtons(pageNumbers);
      container.appendChild(ul);    
      container.appendChild(paginationContainer);
      
      resultContent.innerHTML = "";
      resultContent.appendChild(container);  
    } else {
      resultContent.innerHTML = noResultHTML;
    }

    window.pjax && window.pjax.refresh(resultContent);         
  }  
  
  function handlePaginationButtonClick(event) {
    const target = event.target;
    if (target.classList.contains('pagination-button')) {
      const pageNumber = parseInt(target.textContent);
      currentPage = pageNumber;
      
      fetchData({page: currentPage, pageSize: 10, q: lastSearchText}, onFetchData);
    }
  }  
  
  const inputEventFunction = () => {
    let searchText = searchInputDom.value.trim().toLowerCase();
    
    if (searchText.length > 0) {
      lastSearchText = searchText;
      currentPage = 1;
      // Perform searching
      fetchData({page:1, pageSize:10, q:lastSearchText}, onFetchData)
    } else {
      resetInitState();          
    }
  };
  
  const fetchData = ({page = 1, pageSize = 10, q = ''} = {}, callback) => {
    if (q.trim() == '' || isfetched) return;
    
    const urlObj = new URL(`https://search.techidaily.com/api/search?site=${hostname}`);
    urlObj.searchParams.set('page', page);
    urlObj.searchParams.set('pageSize', pageSize);
    urlObj.searchParams.set('q', q);

    const href = urlObj.href;
    const headers = {
      'Origin': 'https://search.techidaily.com', 
      'Access-Control-Request-Method': 'GET', 
      'Access-Control-Request-Headers': 'Content-Type', 
    };
    
    updateFetchingState();
    isfetched = true;
    
    // Fetch
    fetch(href, { headers })
      .then((response) => response.json())
      .then((res) => {
        // Get the contents from search data
        isfetched = true;
        removeFetchingState();
            
        callback && callback(res);
        isfetched = false;          
      })
      .catch(err => {
        console.error(err);
        isfetched = false;
      })
  };

  if (searchInputDom) {
    searchInputDom.addEventListener("input", inputEventFunction);
  }

  // Handle and trigger popup window
  document.querySelectorAll(".search-popup-trigger").forEach((element) => {
    element.addEventListener("click", () => {
      document.body.style.overflow = "hidden";
      document.querySelector(".search-pop-overlay").classList.add("active");
      setTimeout(() => searchInputDom.focus(), 500);
    });
  });

  // Monitor main search box
  const onPopupClose = () => {
    document.body.style.overflow = "";
    document.querySelector(".search-pop-overlay").classList.remove("active");
  };

  document
    .querySelector(".search-pop-overlay")
    .addEventListener("click", (event) => {
      if (event.target === document.querySelector(".search-pop-overlay")) {
        onPopupClose();
      }
    });
  document
    .querySelector(".search-input-field-pre")
    .addEventListener("click", () => {
      searchInputDom.value = "";
      searchInputDom.focus();
      inputEventFunction();
    });
  document
    .querySelector(".popup-btn-close")
    .addEventListener("click", onPopupClose);
  try {
    swup.hooks.on("page:view", (visit) => {
      onPopupClose();
    });
  } catch (e) {}

  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      onPopupClose();
    }
  });
  
  resetInitState();
}
