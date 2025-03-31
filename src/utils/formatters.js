/* eslint-disable no-console */
export const capitalizeFirstLetter = val => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}
// generate ra card de giu cho tranh th cot rong thi se bi loi
export const generatePlaceholderCard = column => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong.
export const interceptorLoadingElements = calling => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

export const getTextColor = hexColor => {
  // https://gist.github.com/jfsiii/5641126
  // Chuyển từ HEX sang RGB
  let r = parseInt(hexColor.slice(1, 3), 16) / 255
  let g = parseInt(hexColor.slice(3, 5), 16) / 255
  let b = parseInt(hexColor.slice(5, 7), 16) / 255

  // Chuyển đổi giá trị RGB theo chuẩn gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  // Tính độ sáng theo công thức W3C
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Nếu màu quá sáng, đổi chữ sang đen, ngược lại là trắng
  return luminance > 0.5 ? 'black' : 'white'
}

export const getFaviconUrl = url => {
  const domain = new URL(url).origin
  return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
}

export const generateDownloadURL = originalURL => {
  if (!originalURL.includes('/upload/')) return originalURL

  // Thêm `fl_attachment` vào URL
  let downloadURL = originalURL.replace('/upload/', '/upload/fl_attachment/')

  return downloadURL
}

export const downloadFile = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl)
    const blob = await response.blob()

    // Tạo một link ẩn để tải file
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName // Đặt tên file từ attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Lỗi khi tải file:', error)
  }
}
