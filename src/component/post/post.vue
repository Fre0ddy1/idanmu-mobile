<template>
  <transition name="fade">
    <div class="article-detail" v-if="post">
      <div class="top">
        <div class="back" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <h2 v-if="post.title" v-text="post.title.substr(0,24)+'…'"></h2>
      </div>
      <div class="wrap" ref="wrap">
        <div>
          <div class="bio">
            <div class="avatar">
              <img :src="getAvatar(post.author.qq)" v-if="post.author">
              <p v-if="post.author">{{post.author.name}}</p>
            </div>
          </div>
          <div class="content" v-if="post.content" v-lazy-container="{ selector: 'img' }">
            <p v-html="getText(post.content)"></p>
          </div>
        </div>
      </div>
    </div>


  </transition>

</template>

<script>
  import {getOneArticle} from "api/idanmu/article"
  import marked from 'marked'
  import JRoll from 'jroll'

  export default {
    data() {
      return {
        post: {}
      }
    },
    created() {
      this.getOne()
    },
    watch: {
      post: function (val) {
        if (val.content) {
          setTimeout(() => {
            let jroll = new JRoll(this.$refs.wrap, {})
            let imgs = [].slice.call(document.querySelectorAll(".content img"))
            if (imgs) {
              imgs.forEach((i) => {
                i.onload = function () {
                  jroll.refresh()
                }
              })
            }
          }, 20)
        }
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      getOne() {
        getOneArticle(this.$route.params.id).then(res => {
          if (res.data.code === 0) {
            this.post = res.data.result
          }
        })
      },
      getAvatar(qq) {
        return `http://q2.qlogo.cn/headimg_dl?dst_uin=` + qq + `&spec=100`
      },
      getText(content) {
        const str = content.replace(/www.uraban.me/g, 'pic.51xiaoxin.com/www.uraban.me');
        const mark = marked(str, {breaks: true})
        return mark.replace(/src/g, 'data-src')
      },
    }
  }
</script>

<style>
  .article-detail {
    position: fixed;
    background: #171a21;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    font-size: 14px;
  }

  .wrap {
    position: fixed;
    top: 41px;
    bottom: 10px;
    right: 0;
    left: 0;
  }

  .article-detail .top {
    background: #ff677d;
    padding: 12px;
    color: #fff;
    display: flex;
    position: fixed;
    width: 100%;
    z-index: 999;
  }

  .top h2 {
    flex: 1;
    font-size: 14px;
    text-align: center;
  }

  .article-detail .avatar {
    padding: 15px;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .avatar img {
    border-radius: 15px;
    height: 30px;
    width: 30px;
    margin-right: 10px;
  }

  .content {
    padding: 10px;
  }

  .content p img {
    width: 100%;
  }

  blockquote {
    background: #2b2e37;
    padding: 10px;
    margin: 10px 0;
    font-size: 13px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s
  }

  .fade-enter, .fade-leave-to {
    transform: translate3d(100%, 0, 0)
  }

</style>