import { Component, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileManagementService } from '@app/core/http/file-management.service'
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { GridvoUtilsService } from '@app/core/services/gridvo-utils.service'
import moment from 'moment'
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormList, FormListType, ButtonList, FileResponese, FileInfo, ModalTitleEnum, TableData, TableHeader } from './types'
import _ from 'lodash';
@Component({
  selector: 'tb-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  constructor(
    private fileManagementService: FileManagementService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private utils: GridvoUtilsService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  formList: Array<FormList> = [
    {
      formControlName: "fileName",
      label: "文件名称",
      type: FormListType.TEXT,
      placeholder: "文件名称"
    }
  ]
  formData: FormGroup = ((): FormGroup => {
    const fg = this.fb.group({})
    this.formList.forEach(i => {
      fg.addControl(i.formControlName, this.fb.control(""))
    })
    return fg
  })()

  buttonList: Array<ButtonList> = [
    {
      label: "搜索",
      icon: "search",
      clickEvent: () => this.search(),
      show: true
    },
    {
      label: "删除文件",
      icon: "delete",
      clickEvent: () => this.deleteFile(),
      show: false
    },
    {
      label: "批量删除文件",
      icon: "delete",
      clickEvent: () => this.deleteFiles(),
      show: false
    },
    {
      label: "删除目录",
      icon: "delete",
      clickEvent: () => this.deleteDir(),
      show: false
    },
    {
      label: "下载",
      icon: "download",
      clickEvent: () => this.downloadFile(),
      show: false
    },
    {
      label: "查看属性",
      icon: "eye",
      clickEvent: () => this.checkProperty(),
      show: false
    },
    {
      label: "文件上传",
      icon: "cloud-upload",
      clickEvent: () => this.fileUpload(),
      show: false
    }
  ]

  treeNodesData: Array<NzTreeNodeOptions> = []
  selectedNode: NzTreeNode = null

  infoModalVisible: boolean = false
  modalTitle: ModalTitleEnum | "" = ""
  modalConfirmLoading: boolean = false
  cancelButtonShow: boolean = false

  uploadModalVisible: boolean = false

  // 弹窗信息
  infoList: Array<FormList> = [
    {
      formControlName: "fileName",
      label: "文件名称",
      type: FormListType.TEXT,
      placeholder: "文件名称"
    },
    {
      formControlName: "path",
      label: "存储路径",
      type: FormListType.TEXT,
      placeholder: "存储路径"
    },
    {
      formControlName: "size",
      label: "文件大小",
      type: FormListType.TEXT,
      placeholder: "文件大小"
    },
    {
      formControlName: "uploadTime",
      label: "上传时间",
      type: FormListType.TEXT,
      placeholder: "上传时间"
    },
    {
      formControlName: "fileType",
      label: "文件类型",
      type: FormListType.TEXT,
      placeholder: "文件类型"
    }
  ]
  // info form表单数据
  infoFormData: FormGroup = ((): FormGroup => {
    const fg = this.fb.group({})
    this.infoList.forEach(i => {
      fg.addControl(i.formControlName, this.fb.control(""))
    })
    return fg
  })()

  // 上传弹窗列表
  uploadList: Array<FormList> = [
    {
      formControlName: "parentPath",
      label: "上级目录",
      type: FormListType.TEXT,
      placeholder: "上级目录",
      disabled: true
    },
    {
      formControlName: "currentPath",
      label: "当前目录",
      type: FormListType.TEXT,
      placeholder: "当前目录",
      disabled: true
    },
    {
      formControlName: "path",
      label: "目录名",
      type: FormListType.TEXT,
      placeholder: "目录名",
      // errorTip: "请输入存放目录"
    },
  ]
  uploadFormData: FormGroup = ((): FormGroup => {
    const fg = this.fb.group({})
    this.uploadList.forEach(i => {
      fg.addControl(i.formControlName, this.fb.control({ value: "", disabled: i.disabled }))
      if (i.errorTip) {
        fg.get(i.formControlName).setValidators(Validators.required)
      }
    })
    return fg
  })()
  uploadFileList: Array<NzUploadFile> = []
  beforeUpload = (file: NzUploadFile): boolean => {
    this.uploadFileList = [file];
    return false;
  };

  // table data
  tableData: Array<TableData> = []
  tableHeaderList: Array<TableHeader> = [
    {
      prop: "fileName",
      label: "文件名称",
    },
    {
      prop: "fileType",
      label: "文件类型",
      width: "100px",
      ellipsis: true
    },
    {
      prop: "path",
      label: "云盘路径",
      width: "400px"
    },
    {
      prop: "time",
      label: "上传时间",
      formatter: (prop: TableData) => {
        return moment(prop.time * 1000).format("YYYY-MM-DD HH:mm:ss")
      }
    }
  ]
  currentPage: number = 1
  pageSize: number = 10
  setOfCheckedMD5: Set<string> = new Set<string>()
  checkedAll: boolean = false
  indeterminate: boolean = false
  selectedList: Array<TableData> = []
  onCurrentPageDataChange(listOfCurrentPageData: readonly TableData[]) {
  }

  onAllChecked(checked: boolean) {
    if (checked) {
      this.tableData.forEach(i => {
        this.setOfCheckedMD5.add(i.origin.md5)
        this.selectedList.push(i)
      })
      this.checkedAll = true
      this.indeterminate = false
    } else {
      this.tableData.forEach(i => {
        this.setOfCheckedMD5.delete(i.origin.md5)
      })
      this.checkedAll = false
      this.indeterminate = false
    }
    this.setSelectList()
    this.setCheckedAllState()
    this.setButtonShow()
  }

  // 勾选中的列表
  setSelectList() {
    this.selectedList = this.selectedList.filter(i => this.setOfCheckedMD5.has(i.origin.md5))
  }

  // 选择框勾选
  tableCheckedChange(data, md5: string, checked: boolean) {
    if (checked) {
      this.setOfCheckedMD5.add(md5)
      this.selectedList.push(data)
    } else {
      this.setOfCheckedMD5.delete(md5)
    }
    this.setSelectList()
    this.setCheckedAllState()
    this.setButtonShow()
  }

  setCheckedAllState() {
    this.checkedAll = this.tableData.every(i => this.setOfCheckedMD5.has(i.origin.md5))
    this.indeterminate = this.tableData.some(i => this.setOfCheckedMD5.has(i.origin.md5)) && !this.checkedAll
  }

  // 清空选择
  clearTableData() {
    this.setOfCheckedMD5.clear()
    this.selectedList = []
    this.checkedAll = false
    this.indeterminate = false
    this.tableData = []
  }

  ngOnInit(): void {
    this.setInfoFormDataDisable()
    this.getFilesList().then((res: Array<FileResponese>) => {
      this.treeNodesData = this.trans2TreeNode(res)
      this.cd.detectChanges()
    })
  }

  // 将数据转换成树节点
  trans2TreeNode(arr: Array<FileResponese>, parentNode?: NzTreeNode): Array<NzTreeNodeOptions> {
    return arr.map(i => {
      const { rename, name, md5, is_dir } = i
      return {
        title: rename || name,
        key: md5,
        isLeaf: !is_dir,
        originData: {
          ...i,
          parentNode
        }
      }
    })
  }

  // 获取文件列表
  getFilesList(fetchValue?: { [key: string]: any }): Promise<Array<FileResponese>> {
    const _fetchValue = fetchValue || {}
    return new Promise<Array<FileResponese>>((resolve, reject) => {
      this.fileManagementService.getFilesList(_fetchValue).subscribe(
        (res: Array<FileResponese>) => {
          resolve(res)
        },
        error => {
          reject(error)
        })
    })
  }

  // 获得文件详情
  async getFilesInfo() {
    const { md5, path } = this.selectedNode.origin.originData as FileResponese
    const res = await this.fileManagementService.getFilesInfo({ md5, path }).toPromise()
    return res
  }

  // 节点点击
  async handleNodeClick(e?: NzFormatEmitEvent) {
    this.clearTableData()
    if (e) {
      this.selectedNode = e.node
    }
    this.setButtonShow()
    if (!this.selectedNode.origin.originData.is_dir) {
      return
    }
    await this.getFileListByDir(this.selectedNode)
    // if (!this.selectedNode.children.length) {
    // }
    let arr = []
    this.selectedNode.children.forEach(i => {
      const { name, path, mtime, is_dir, md5, size } = i.origin.originData as FileResponese
      if (!is_dir) {
        arr.push({
          fileName: name,
          fileType: name.split(".").pop(),
          path: path + "/" + name,
          time: mtime,
          origin: { ...i, md5: md5 },
          size
        })
      }
    })
    this.tableData = arr
  }

  // 节点展开
  handleNodeExpandChange(e: NzFormatEmitEvent) {
    if (e.node.children.length) {
      return
    }
    this.getFileListByDir(e.node)
  }

  // 依照文件夹获取列表
  async getFileListByDir(node: NzTreeNode): Promise<NzTreeNode> {
    return new Promise((resolve, reject) => {
      const { path, name } = node.origin.originData as FileResponese
      const dir = path === "/" ? `${path}${name}` : `${path}/${name}`
      const fetchValue = { dir: dir }
      this.getFilesList(fetchValue).then((res: Array<FileResponese>) => {
        node.clearChildren()
        node.addChildren(this.trans2TreeNode(res, node))
        resolve(node)
      }, err => {
        node.clearChildren()
        node.addChildren([])
        reject(err)
      })
    })
  }

  // 搜索
  search() {
    this.clearTableData()
    this.fileManagementService.searchFiles({ kw: this.formData.get('fileName').value }).subscribe((res: Array<FileInfo>) => {
      this.tableData = res.map((i) => {
        const { name, path, timeStamp, size } = i
        return {
          fileName: name,
          fileType: name.split(".").pop(),
          path: path + "/" + name,
          time: timeStamp,
          origin: i,
          size
        }
      })
      this.cd.detectChanges()
    })
  }

  // 删除目录
  deleteDir() {
    const { title, originData } = this.selectedNode.origin
    this.modal.confirm({
      nzTitle: `删除目录`,
      nzContent: `确定要删除目录${title}吗？`,
      nzOnOk: () => {
        const path = this.getPath(this.selectedNode)
        this.fileManagementService.deleteDir({ dir: path }, { ignoreErrors: true }).subscribe(res => {
          this.message.success("删除成功")
          this.getFileListByDir(originData.parentNode)
        }, err => {
          switch (err.status) {
            case 401: {
              this.message.error("删除失败：受保护的目录，无法删除")
              break;
            }
            case 500: {
              this.message.error("删除失败：需将目录下的所有子目录及文件都删除后，才能删除目录")
              break;
            }
            default: {
              this.message.error("删除失败：" + err.error.detail)
            }
          }
        })
      }
    });
  }

  // 删除文件
  deleteFile() {
    const { md5, name, parentNode } = this.selectedNode.origin.originData
    this.modal.confirm({
      nzTitle: `删除文件`,
      nzContent: `确定要删除${name}吗？`,
      nzOnOk: () => {
        this.fileManagementService.deleteFile({ md5 }).subscribe(res => {
          this.message.success("删除成功")
          // this.getFileListByDir(parentNode)
          this.getExpandedNodeList()
        },
          err => {
            this.message.error("删除失败：" + err.message)
          })
      }
    });
  }

  getExpandedNodeList() {
    Promise.all(this.nzTreeComponent.getExpandedNodeList().map(i => i.parentNode ? this.getFileListByDir(i.parentNode) : this.getFileListByDir(i))).then(values => {
      // this.handleNodeClick({ eventName: 'any' }, this.selectedNode)
      if (this.formData?.get("fileName").value) {
        this.search()
      } else {
        this.handleNodeClick()
      }
    })
  }

  // 批量删除文件
  deleteFiles() {
    this.modal.confirm({
      nzTitle: `批量删除文件`,
      nzContent: `确定要删除${this.selectedList.length}个文件吗？`,
      nzOnOk: () => {
        Promise.all(this.selectedList.map(i => this.fileManagementService.deleteFile({ md5: i.origin.md5 }).toPromise())).then(async (values) => {
          this.message.success("删除成功")
          this.getExpandedNodeList()
        }).catch(err => {
          console.log('err :>> ', err);
        })
      }
    });
  }

  // 下载文件
  downloadFile() {
    const { path, is_dir, name } = this.selectedNode.origin.originData as FileResponese
    if (is_dir) {
      return
    }
    let origin = process.env.NODE_ENV === "development" ? "http://10.0.5.92:30661" : location.origin
    // download: 1 = 下载， 0 = 打开
    const openUrl = `${origin}/group1${path}/${name}?download=1`
    window.open(openUrl)
  }

  // 查看属性
  async checkProperty() {
    this.infoModalVisible = true
    const res = await this.getFilesInfo()
    const { name, path, size, timeStamp } = res as FileInfo
    this.infoFormData.patchValue({
      fileName: name,
      path,
      size: this.utils.transSize2String(size),
      uploadTime: moment(timeStamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
      fileType: name.split(".").pop()
    })
  }

  // 文件上传
  fileUpload() {
    const { name, path } = this.selectedNode.origin.originData as FileResponese
    this.uploadFormData.patchValue({
      parentPath: path.split("/").pop(),
      currentPath: name,
      path: ""
    })
    this.uploadFileList = []
    this.uploadModalVisible = true
  }

  // 上传弹窗确认
  uploadModalConfirm() {
    if (!this.uploadFormData.valid) {
      Object.values(this.uploadFormData.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return
    }
    if (!this.uploadFileList.length) {
      return this.message.error("请上传文件")
    }
    this.modalConfirmLoading = true
    let scene = this.getScene(this.selectedNode)
    let _path = "/" + this.getPath(this.selectedNode)
    const documentPath = this.uploadFormData.get("path").value
    if (documentPath) {
      _path += `/${documentPath}`
    }
    const formData = new FormData()
    formData.append("file", this.uploadFileList[0] as any)
    formData.append("scene", scene)
    formData.append("output", "json")
    formData.append("path", _path)
    formData.append("auth_token", localStorage.getItem("jwt_token"))
    this.fileManagementService.fileUpload(formData).subscribe(res => {
      this.modalConfirmLoading = false
      if (res.status === "fail") {
        return this.message.error("上传失败：" + res.message)
      }
      this.message.success("上传成功")
      this.getExpandedNodeList()
      // this.getFileListByDir(this.selectedNode)
      this.uploadModalVisible = false
    },
      err => {
        this.message.error("上传失败：" + err.message)
        this.modalConfirmLoading = false
      })
  }

  // 递归获得场景
  getScene(node: NzTreeNode): string {
    if (node.parentNode) {
      return this.getScene(node.parentNode)
    }
    return node.origin.originData.name
  }

  // 递归获得路径
  getPath(node: NzTreeNode): string {
    let path = (node.origin.originData as FileResponese).name
    if (node.parentNode) {
      return path = this.getPath(node.parentNode) + "/" + path
    }
    return path
  }

  // 设置infoFormData成禁用
  setInfoFormDataDisable() {
    this.infoFormData.disable()
  }

  // 获得is_dir，true：是个目录， false：是个文件
  getIsDir(): boolean {
    return !!this.selectedNode?.origin?.originData?.is_dir
  }

  // 设置button 显示
  setButtonShow() {
    const alwaysShowArr = ["搜索"]
    const showByIsDir = ["文件上传", "删除目录"]
    const showByReverseIsDir = ["删除文件", "下载", "查看属性"]
    const isDir = this.getIsDir()
    this.buttonList.forEach(i => {
      const { label } = i
      if (alwaysShowArr.includes(label)) {
        i.show = true
      }
      if (showByIsDir.includes(label)) {
        i.show = isDir
      }
      if (showByReverseIsDir.includes(label)) {
        i.show = !isDir
      }

      // 特殊处理
      if (label === "批量删除文件") {
        i.show = !!this.setOfCheckedMD5.size
      }
    })
  }

  // 操作栏确认删除
  popConfirm(data: TableData) {
    this.fileManagementService.deleteFile({ md5: data.origin.md5 }).subscribe(res => {
      this.message.success("删除成功")
      if (this.formData.get("fileName").value) {
        this.search()
      }
      this.getExpandedNodeList()
      // this.getFileListByDir(this.selectedNode.origin.originData.parentNode)
    },
      err => {
        this.message.error("删除失败：" + err.message)
      })
  }

  // 查看属性
  checkDetail(data: TableData) {
    this.infoModalVisible = true
    const { fileName, path, time, fileType, size } = data
    this.infoFormData.patchValue({
      fileName,
      path,
      size: this.utils.transSize2String(size),
      uploadTime: moment(time * 1000).format("YYYY-MM-DD HH:mm:ss"),
      fileType
    })
  }

  // page change
  onPageChange(page: number) {
    this.currentPage = page
  }

  // page size change
  nzPageSizeChange(size: number) {
    this.pageSize = size
  }
}
