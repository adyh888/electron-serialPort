<template>
  <div class="uploadMian">
    <div class="img-item" v-for="(item, index) in fileList" :key="index">
      <img :src="item.src" />
      <el-icon class="uploader-close" @click="delFn(index)"><Close /></el-icon>
      <div v-if="item.isSuccess || uploadSuccess" class="uploader-Check">
        <el-icon><Check /></el-icon>
      </div>
      <div class="button-div" v-if="item.file && isCropper">
        <el-button v-if="uploadShow" type="success" @click="uploadFileFn(item, index)">上传</el-button>
        <el-button type="primary" @click="cropperFn(item, index)">裁剪</el-button>
      </div>
    </div>
    <el-upload v-if="multiple || (!multiple && fileList.length == 0)" class="avatar-uploader" action="#" :accept="acceptArray.length > 0 ? acceptArray.map(n => acceptType[n]).join(',') : '*'" :http-request="!isCropper ? uploadFileFn : () => {}" :multiple="multiple" :show-file-list="false" :before-upload="beforeAvatarUpload">
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>

  <el-dialog title="裁切图片" v-model="showCropper" width="550px">
    <div class="cropper-content">
      <div class="cropper-box">
        <div class="cropper">
          <vue-cropper
            ref="cropperRefs"
            :img="option.img"
            :output-size="option.outputSize"
            :info="option.info"
            :can-scale="option.canScale"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :full="option.full"
            :fixed-box="option.fixedBox"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :center-box="option.centerBox"
            :height="option.height"
            :info-true="option.infoTrue"
            :max-img-size="option.maxImgSize"
            :enlarge="option.enlarge"
            :mode="option.mode"
            :limit-min-size="option.limitMinSize"
          />
        </div>
      </div>
    </div>
    <span slot="footer">
      <div class="dialog-footer">
        <el-button @click="showCropper = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, inject } from 'vue'
import { Plus, Close, Check } from '@element-plus/icons-vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const props = defineProps({
  // 额外值
  otherData: {
    type: Object,
    default: () => {}
  },
  // 请求头
  headers: {
    type: Object,
    default: () => {}
  },
  //  参数值
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 多选
  multiple: {
    type: Boolean,
    default: false
  },
  //   大小限制：10 * 1024 * 1024 = 10MB
  size: {
    type: Number,
    default: 10 * 1024 * 1024
  },
  // 是否需要裁剪
  isCropper: {
    type: Boolean,
    default: true
  },
  // 请求的url
  sendUrl: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue'])
const cropperRefs = ref()
const cropperCb = ref(null)
const showCropper = ref(false)
let fileList = reactive([])
const acceptArray = reactive(['png', 'jpg', 'jpeg', 'JPG']) //选择类型
const acceptType = reactive({
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  csv: '.csv',
  txt: 'text/plain',
  image: 'image/*',
  png: 'image/png',
  gif: 'image/gif',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg'
})

// 监听传入的值
watch(
  props.modelValue,
  value => {
    const valueList = value || []
    let newFileList = []
    valueList.forEach(item => {
      const indexThis = fileList.findIndex(n => n.src == item)
      if (indexThis == -1) {
        newFileList.push({
          src: item.src,
          file: item.file,
          isSuccess: true
        })
      }
    })
    fileList.unshift(...newFileList)
    // console.log(144, fileList)
  },
  { immediate: true, deep: true }
)

// 监听当前页面的fileList
watch(
  fileList,
  value => {
    // console.log(152, value)
    const valueList = value
      .map(n => {
        if (n.isSuccess) {
          return n.src
        }
        return null
      })
      .filter(n => n != null)
    emits('update:modelValue', value)
  },
  { deep: true }
)

// 裁剪的配置
const option = reactive({
  img: '', // 裁剪图片的地址
  outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
  outputType: 'jpeg', // 裁剪生成图片的格式（jpeg || png || webp）
  info: false, // 图片大小信息
  canScale: true, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 230, //默认生成截图框宽度
  autoCropHeight: 150, //默认生成截图框高度
  fixed: false, // 是否开启截图框宽高固定比例
  fixedNumber: [1.53, 1], //截图框的宽高比例
  full: false, // false按原比例裁切图片，不失真
  fixedBox: false, // 固定截图框大小，不允许改变
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  original: true, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  high: false, // 是否按照设备的dpr 输出等比例图片
  infoTrue: false, // true为展示真实输出图片宽高，false展示看到的截图框宽高
  maxImgSize: 3000, // 限制图片最大宽度和高度
  enlarge: 1, // 图片根据截图框输出比例倍数
  mode: '550px 400px', // 图片默认渲染方式
  limitMinSize: [108, 108], // 裁剪框限制最小区域
  minCropBoxWidth: 108, // 设置最小裁切框宽度
  minCropBoxHeight: 108 // 设置最小裁切框高度
})

// 类型，大小判断
const judegFileSize = file => {
  const filterSize = size => {
    const pow1024 = num => {
      return Math.pow(1024, num)
    }
    if (!size) return ''
    if (size < pow1024(1)) return size + ' B'
    if (size < pow1024(2)) return (size / pow1024(1)).toFixed(0) + ' KB'
    if (size < pow1024(3)) return (size / pow1024(2)).toFixed(0) + ' MB'
    if (size < pow1024(4)) return (size / pow1024(3)).toFixed(0) + ' GB'
    return (size / pow1024(4)).toFixed(2) + ' TB'
  }
  let retunBoolean = true
  let fileSize = file.size
  //判断文件类型
  const fileExtArray = file.name.split('.')
  const judegFn = () => {
    if (acceptArray.indexOf(fileExtArray.at(-1)) == -1) {
      alert(`${file.name}上传失败，只能上传${acceptArray.join('、')}`)
      retunBoolean = false
    }
  }
  if (acceptArray.length > 0) {
    if (acceptArray.indexOf('image') != -1) {
      var pattern = /(\.jpg|\.jpeg|\.png|\.gif)$/i
      // 判断文件名是否匹配图片格式的正则表达式
      if (!pattern.test(`.${fileExtArray.at(-1)}`)) {
        judegFn()
      }
    } else {
      judegFn()
    }
  }
  if (retunBoolean) {
    if (props.size > 0 && fileSize > props.size) {
      alert(`最大上传${filterSize(props.size)}`)
      retunBoolean = false
    }
  }
  return retunBoolean
}
const beforeAvatarUpload = rawFile => {
  let retunBoolean = judegFileSize(rawFile)
  if (retunBoolean) {
    fileList.push({
      src: URL.createObjectURL(rawFile),
      file: rawFile
    })
  }
  return retunBoolean
}

// 裁剪
const cropperFn = (item, index) => {
  showCropper.value = true
  option.img = URL.createObjectURL(item.file)
  const reader = new FileReader()
  reader.readAsDataURL(item.file)
  cropperCb.value = res => {
    if (res) {
      cropperRefs.value.getCropBlob(data => {
        const result = new File([data], item.file.name, {
          type: item.file.type,
          lastModified: Date.now()
        })
        result['uid'] = item.file.uid
        fileList.splice(index, 1, {
          src: URL.createObjectURL(result),
          file: result
        })
        showCropper.value = false
      })
    }
  }
}

// 删除
const delFn = index => {
  fileList.splice(index, 1)
}
// 弹窗确定裁剪
const onSubmit = () => {
  if (cropperCb.value) cropperCb.value(true)
}

// 真实上传
// const uploadFileFn = item => {
//   if (props.sendUrl == '') return false
//   const successFn = url => {
//     const index = fileList.findIndex(n => {
//       if (n.file && n.file.uid == item.file.uid) {
//         return true
//       }
//       return false
//     })
//     if (index != -1) {
//       fileList.splice(index, 1, {
//         src: url,
//         file: item.file,
//         isSuccess: true
//       })
//     }
//   }
//   // successFn(item.src);
//   const formData = new FormData()
//   formData.append('imageBytes', item.file)
//   if (props.otherData) {
//     Object.keys(props.otherData).forEach(key => {
//       formData.append(key, props.otherData[key])
//     })
//   }
//   //接口请求
//   fetch(props.sendUrl, {
//     method: 'POST',
//     body: formData,
//     headers: props.headers,
//     'Content-type': 'multipart/form-data'
//   })
//     .then(respone => respone.json())
//     .then(res => {
//       // 接口成功后替换url
//       successFn('成功的url')
//     })
//     .catch(error => {
//       // 接口失败的
//     })
// }

/**
 * injects
 */
const { uploadFileFn, uploadSuccess, uploadShow } = inject('dataProvide')
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  border: 1px solid #ccc;
  width: 178px;
  height: 178px;
  text-align: center;
}

.uploadMian {
  vertical-align: top;

  display: flex;
  flex-wrap: wrap;
}
.avatar-uploader {
}

.img-item {
  display: inline-block;
  width: 178px;
  height: 178px;
  margin-right: 10px;
  border: 1px solid #ccc;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 9;
  }
  &:hover {
    .el-icon.uploader-close {
      display: flex !important;
    }
  }
  .uploader-Check {
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 18;
    top: 0;
    left: 0;
    display: flex;
    background-color: #67c23a;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    -webkit-clip-path: polygon(0 0, 100% 0, 0 100%);
    .el-icon {
      position: absolute;
      top: 4px;
      left: 4px;
      color: #fff;
    }
  }
  .el-icon.uploader-close {
    display: none;
    position: absolute;
    z-index: 20;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background-color: red;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }
  .button-div {
    position: absolute;
    height: 45px;
    z-index: 20;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  .cropper-box {
    width: 550px;
    .cropper {
      width: auto;
      height: 400px;
    }
  }

  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    .preview {
      overflow: hidden;
      border: 1px solid #67c23a;
      background: #cccccc;
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
