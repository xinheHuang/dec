<template>
  <div id="login">
    <div class="center">
      <div class="logo">
        <img src="../../../static/logo.png"/>
        <h3 class="text"><span>熵</span><span style="margin-left: 20px">简</span></h3>
      </div>
      <h3 style="text-align: center;color: rgb(217,217,217);font-weight: normal;font-size: 40dpx">专注智能投研辅助决策工具</h3>
      <div class="table">
        <div class="tab">
          <span :class="{selected:current=='login'}"
                @click="changeTab('login')">登录</span>
          <span :class="{selected:current=='register'}"
                @click="changeTab('register')"
                style="margin-left:20px">注册</span>
        </div>
        <div class="inputTable">
          <div v-if="current=='login'"
               @keyup.enter="login()">
            <input placeholder="用户名"
                   v-model="loginUsername"
                   type="text">
            <input placeholder="密码"
                   v-model="loginPwd"
                   type="password">
            <button type="submit"
                    @click="login()">登录{{isPost?'中...':''}}
            </button>
          </div>
          <div v-if="current=='register'"
               @keyup.enter="register()">
            <input placeholder="姓名"
                   v-model="registerName"
                   type="text">
            <input placeholder="所在公司"
                   v-model="registerCompany"
                   type="text">
            <select v-model="registerPosition"
                    :class="{selected:!registerPosition}"
                    style="padding-left: 5px">
              <option disabled
                      value=""> 您的职位
              </option>
              <option v-for="pos in positions"
                      :value="pos">
                {{pos}}
              </option>
            </select>
            <input placeholder="手机号（仅支持中国大陆）"
                   v-model="registerMobile"
                   type="tel">
            <input placeholder="密码（不少于6位）"
                   v-model="registerPwd"
                   type="password">

            <button type="submit"
                    @click="register()">注册熵简{{isPost?'中...':''}}
            </button>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import crypto from 'crypto'
  import EventBus from "../../eventBus"
  import {checkMobile} from '../../utils'

  export default {
    data() {
      return {
        current: 'login',
        loginUsername: null,
        loginPwd: null,
        registerName: null,
        registerCompany: null,
        registerPosition: "",
        registerMobile: null,
        registerPwd: null,
        positions: ['研究员', '基金经理'],
        isPost: false
      }
    },
    methods: {
      changeTab(tab) {
        if (this.current == tab) return
        this.current = tab
      },

      login() {
        const {loginUsername, loginPwd} = this
        if (!loginUsername || !loginPwd) {
          EventBus.$emit('errorDialog', {
            text: '用户名和密码不能为空'
          })
          return
        }
        this.isPost = true
        const hash = crypto.createHash('md5')
        hash.update(loginPwd)
        this.$http.post('/api/auth/login', {
          username: loginUsername,
          password: hash.digest('hex')
        })
            .then(res => {
              this.isPost = false
              this.$router.push(this.$route.query.redirect || '/')
            })
            .catch((err) => {
              this.isPost = false
            })
      },

      register() {
        const {registerName, registerCompany, registerPosition, registerMobile, registerPwd} = this
        if (!checkMobile(registerMobile)) {
          EventBus.$emit('errorDialog', {
            text: '手机号码格式不正确'
          })
          return
        }
        if (!(registerPwd && registerPwd.length >= 6)) {
          EventBus.$emit('errorDialog', {
            text: '密码格式不正确'
          })
          return
        }
        if (!registerName) {
          EventBus.$emit('errorDialog', {
            text: '姓名不能为空'
          })
          return
        }
        if (!registerCompany) {
          EventBus.$emit('errorDialog', {
            text: '公司不能为空'
          })
          return
        }
        if (!registerPosition) {
          EventBus.$emit('errorDialog', {
            text: '职位不能为空'
          })
          return
        }
        this.isPost = true
        const hash = crypto.createHash('md5')
        hash.update(registerPwd)
        this.$http.post('/api/auth/register', {
          username: registerMobile,
          name: registerName,
          position: registerPosition,
          broker: registerCompany,
          industry: '',
          password: hash.digest('hex')
        })
            .then(res => {
              this.isPost = false
              this.$router.push(this.$route.query.redirect || '/')
            })
            .catch(err => {
              this.isPost = false
            })
      }
    }
  }
</script>
<style lang="less"
       scoped>
  @blue: rgb(91, 155, 213);
  @gray: rgb(217, 217, 217);
  #login {
    height: 100%;
    width: 100%;
    background: url("../../assets/images/login_bg.jpg");
    background-size: 100% 100%;
    display: flex;
    /*align-items: center;*/
    justify-content: center;
    .center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .logo {
        margin-top: -200px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 80px;
          width: auto;
        }
        .text {
          font-size: 80px;
          margin: 0 0 0 20px;
          color: @blue;
        }
      }
      .table {
        width: 350px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .tab {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          > span {
            cursor: pointer;
            font-size: 24px;
            color: @gray;
            padding-bottom: 10px;
            border: none;
            &.selected {
              color: @blue;
              border-bottom: solid 2px @blue;
            }
          }
        }

        .inputTable {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          input, select {
            option {
              background: white;
              color: black;
            }
            &.selected {
              color: rgba(255, 255, 255, 0.5);
            }
            white-space: normal;
            width: 100%;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            /*color: rgba(255,255,255,0.5);*/
            color: rgba(255, 255, 255, 1);
            &::placeholder {
              color: rgba(255, 255, 255, 0.5);
            }
            font-size: 16px;
            border: solid 1px @gray;
            border-top: none;
            &:first-child {
              border-top: solid 1px @gray;
            }
          }
          button {
            width: 100%;
            box-sizing: border-box;
            background: @blue;
            color: white;
            border: none;
            margin-top: 20px;
            font-size: 18px;
            padding: 10px;
          }
        }

      }
    }
  }
</style>
