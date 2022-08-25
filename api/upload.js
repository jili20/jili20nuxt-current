export default ({$axios}, inject) => {

  // 上传照片到阿里云 OSS  /article/upload/{type}
  inject('uploadImg', (type, data) => $axios.$post(`/article/upload/${type}`, data))

  // 删除阿里云 OSS 图片 /article/file/delete?fileUrl=xxx
  inject('deleteImg', fileUrl => $axios.$delete('/article/upload/delete', {params: {fileUrl}}))

}
