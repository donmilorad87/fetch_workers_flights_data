export const fetcher = async (...args) => {
    try {
      document.documentElement.style.cursor = 'progress'
       const response = await fetch(...args)
       return await response.json()
    } catch (error) {
       console.log(error)
    }
 }