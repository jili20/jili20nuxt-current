<!--<template>-->
<!--  &lt;!&ndash; 留言区&ndash;&gt;-->
<!--  <div class="comment-box">-->
<!--    <div class="in-box">-->
<!--      <h1>留言区 {{ total }}</h1>-->
<!--      &lt;!&ndash; 发表留言 &ndash;&gt;-->
<!--      <div class="add-one">-->
<!--        <div>-->
<!--          &lt;!&ndash; 1、新增留言-表单 &ndash;&gt;-->
<!--          <el-form :model="commentData">-->
<!--            &lt;!&ndash; 当前用户头像 &ndash;&gt;-->
<!--            <nuxt-link :to="'/user/'+userId" v-if="userId">-->
<!--              <img :src="avatar" alt="" lazy>-->
<!--            </nuxt-link>-->
<!--            &lt;!&ndash; maxRows: 10  &ndash;&gt;-->
<!--            <el-input-->
<!--              maxlength="1000"-->
<!--              type="textarea"-->
<!--              :autosize="{ minRows: 2}"-->
<!--              clearable-->
<!--              placeholder="发表一条真诚的留言..."-->
<!--              v-model="commentData.content"-->
<!--              @keyup.enter.native="addComment">-->
<!--            </el-input>-->
<!--            <el-button v-if="userId !== 0" class="add-com-btn" type="primary" @click="addComment"><p class="mb2">发表</p><p>留言</p></el-button>-->
<!--            <el-button v-else class="add-com-btn" type="primary"><p class="mb2">发表</p><p>留言</p></el-button>-->
<!--          </el-form>-->
<!--        </div>-->
<!--      </div>-->
<!--      &lt;!&ndash; /发表留言 &ndash;&gt;-->
<!--      &lt;!&ndash; 留言展示区 &ndash;&gt;-->
<!--      <ul class="com-one">-->
<!--        &lt;!&ndash; 排序 开始 &ndash;&gt;-->
<!--        <div class="order" v-if="total > 0">-->
<!--          <span :class="{orderActive:searchObj.thumbCount}" @click="searchThumbCount">-->
<!--            <span>按热度排序</span><i v-if="searchObj.thumbCount ===1">↓</i></span>-->
<!--          <el-divider direction="vertical"/>-->
<!--          <span :class="{orderActive:searchObj.createTime}" @click="searchCreateTime">-->
<!--            按时间排序<i v-if="searchObj.createTime ==1">↓</i></span>-->
<!--        </div>-->
<!--        <li class="li" v-for="(item,index) in commentList" :key="item.id">-->
<!--          &lt;!&ndash; 留言列表 &ndash;&gt;-->
<!--          <div class="com-one-content">-->
<!--            <nuxt-link :to="'/user/'+item.userId">-->
<!--              <img :src="item.avatar" alt="" lazy>-->
<!--            </nuxt-link>-->
<!--            <div class="right">-->
<!--              <nuxt-link :to="'/user/'+item.userId">-->
<!--                <b>{{ item.username }}</b>-->
<!--                <el-divider direction="vertical" v-if="item.userId === authorId"/>-->
<!--                <p v-if="item.userId === authorId" class="author"> 作者</p>-->
<!--                <el-divider direction="vertical"/>-->
<!--                <span class="author-span"-->
<!--                      v-if="item.replyCount > 0 ">共 {{ item.replyCount }} 条回复</span>-->
<!--              </nuxt-link>-->
<!--              <p class="item-content" v-if="item.content">{{ item.content }}</p>-->
<!--              <div class="com-time">-->
<!--                <div>-->
<!--                  <span>{{ item.createTime }}</span>-->
<!--                  <el-divider direction="vertical"/>-->
<!--                  &lt;!&ndash; 点赞留言：根据条件显示不同的样式 userThumb ，调用同一个接口，包含点赞与取消点赞 &ndash;&gt;-->
<!--                  <span v-if="item.userThumb" @click="addCommentThumb(item.id,item.userId)">-->
<!--                <i class="iconfont icon-icon_dianzan-mian"/> {{ item.thumbCount }} </span>-->
<!--                  &lt;!&ndash; 取消点赞 &ndash;&gt;-->
<!--                  <span v-else @click="addCommentThumb(item.id,item.userId)">-->
<!--                <i class="iconfont icon-zan1"/> {{ item.thumbCount }} </span>-->
<!--                  <el-divider direction="vertical"/>-->
<!--                  <span @click="openAddReplyBox(index)">回复</span>-->
<!--                </div>-->
<!--                <div class="del-com">-->
<!--                  &lt;!&ndash; 删除、举报留言 &ndash;&gt;-->
<!--                  <el-tooltip placement="top">-->
<!--                    <div slot="content">-->
<!--                      &lt;!&ndash; 删除留言 &ndash;&gt;-->
<!--                      <p v-if="userId === item.userId" class="do-com" @click="removeCommentById(item.id)">删除</p>-->
<!--                      &lt;!&ndash; 举报留言 &ndash;&gt;-->
<!--                      <p v-if="userId !== item.userId" class="do-com" @click="openOrCloseReportComment(index)">举报</p>-->
<!--                    </div>-->
<!--                    &lt;!&ndash; 。。。 &ndash;&gt;-->
<!--                    <i class="el-icon-more-outline"/>-->
<!--                  </el-tooltip>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 新增举报留言 &ndash;&gt;-->
<!--          <div class="report-comment-box" v-show="reportCommentIndex===index">-->
<!--            <h1>举报留言</h1>-->
<!--            <el-divider/>-->
<!--            <p>举报留言内容：</p>-->
<!--            <p class="rp-con"> {{ item.content }}</p>-->
<!--            <el-divider/>-->
<!--            <p>留言发布人：{{ item.username }}</p>-->
<!--            <el-divider/>-->
<!--            <el-form-->
<!--              :model="reportCommentData"-->
<!--              label-width="100px"-->
<!--              label-position="top"-->
<!--              status-icon>-->
<!--              <el-form-item label="举报类型：" prop="reportType">-->
<!--                <el-radio-group v-model="reportCommentData.reportType" size="small">-->
<!--                  <el-radio-button :label="1">作品侵权</el-radio-button>-->
<!--                  <el-radio-button :label="2">涉嫌违法</el-radio-button>-->
<!--                  <el-radio-button :label="3">内容不雅</el-radio-button>-->
<!--                  <el-radio-button :label="4">骚扰谩骂</el-radio-button>-->
<!--                  <el-radio-button :label="5">广告欺诈</el-radio-button>-->
<!--                  <el-radio-button :label="6">低质灌水</el-radio-button>-->
<!--                  <el-radio-button :label="7">其它</el-radio-button>-->
<!--                </el-radio-group>-->
<!--              </el-form-item>-->
<!--              <el-divider/>-->
<!--              <el-form-item label="补充说明：" prop="explain">-->
<!--                <el-input type="textarea" :rows="3" v-model="reportCommentData.description" maxlength="500" clearable/>-->
<!--              </el-form-item>-->
<!--              <el-divider/>-->
<!--              <p>站务会尽快处理您的举报，处理结果，请留意站内通知!</p>-->
<!--              <p>感谢您为共建文明社区付出!</p>-->
<!--              <br>-->
<!--              <el-form-item align="right">-->
<!--                <el-button @click="openOrCloseReportComment(index)">取消</el-button>-->
<!--                <el-button type="primary">提交-->
<!--                </el-button>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </div>-->
<!--          &lt;!&ndash; /新增举报留言 &ndash;&gt;-->
<!--          &lt;!&ndash; 2、新增回复-表单 &ndash;&gt;-->
<!--          <el-form class="form" :model="replyData" v-show="activeIndex===index">-->
<!--            &lt;!&ndash; 当前用户头像 &ndash;&gt;-->
<!--            <nuxt-link :to="'/user/'+userId" v-if="userId">-->
<!--              <img :src="avatar" alt="" lazy>-->
<!--            </nuxt-link>-->
<!--            &lt;!&ndash; maxRows: 10  &ndash;&gt;-->
<!--            <el-input-->
<!--              maxlength="1000"-->
<!--              type="textarea"-->
<!--              :autosize="{ minRows: 2}"-->
<!--              clearable-->
<!--              :placeholder="'@ '+item.username"-->
<!--              v-model="replyData.content"-->
<!--              @keyup.enter.native="addReply(item.id,replyData.content,item.id,item.userId,item.replyCount,index)">-->
<!--            </el-input>-->
<!--            <el-button type="primary"-->
<!--                       @click="addReply(item.id,replyData.content,item.id,item.userId,item.replyCount,index)">-->
<!--              <p class="mb2">发表</p>-->
<!--              <p>回复</p>-->
<!--            </el-button>-->
<!--          </el-form>-->
<!--          &lt;!&ndash; 回复展示区 &ndash;&gt;-->
<!--          <ul class="com-two">-->
<!--            &lt;!&ndash; 回复-最热前三条 &ndash;&gt;-->
<!--            <li v-for="(reply,index) in item.children" :key="index" v-if="item.id !== commentId">-->
<!--              <div class="reply-box">-->
<!--                <nuxt-link :to="'/user/'+reply.fromUserId">-->
<!--                  <img :src="reply.fromAvatar" alt="" lazy>-->
<!--                </nuxt-link>-->
<!--                <div class="rep-content">-->
<!--                  <nuxt-link :to="'/user/'+reply.fromUserId">-->
<!--                    <span class="from-username">{{ reply.fromUsername }} </span>-->
<!--                    <el-divider direction="vertical" v-if="reply.fromUserId === authorId"/>-->
<!--                    <span v-if="reply.fromUserId === authorId" class="author-reply"> 作者 </span>-->
<!--                  </nuxt-link>-->
<!--                  <el-divider direction="vertical"/>-->
<!--                  <nuxt-link :to="'/user/'+reply.toUserId" v-if="reply.commentId != reply.rootId">-->
<!--                    <span class="rep-username"> 回复  <b> {{ reply.toUsername }}</b> </span>-->
<!--                    <el-divider direction="vertical"/>-->
<!--                  </nuxt-link>-->
<!--                  <span class="fs14">{{ reply.content }}</span>-->
<!--                  <div class="time">-->
<!--                    <div class="rep-top3-time">-->
<!--                      <span>{{ reply.createTime }}</span>-->
<!--                      <el-divider direction="vertical"/>-->
<!--                      &lt;!&ndash; 点赞回复：根据条件显示不同的样式 userThumb ，调用同一个接口，包含点赞与取消点赞 &ndash;&gt;-->
<!--                      <span v-if="reply.userThumb"-->
<!--                            @click="addReplyThumb(reply.id,reply.fromUserId,item.id,item.replyCount)"><i-->
<!--                        class="iconfont icon-icon_dianzan-mian"/> {{ reply.thumbCount }} </span>-->
<!--                      <span v-else @click="addReplyThumb(reply.id,reply.fromUserId,item.id,item.replyCount)"><i-->
<!--                        class="iconfont icon-zan1"/> {{ reply.thumbCount }} </span>-->
<!--                      <el-divider direction="vertical"/>-->
<!--                      <span @click="openReplyTargetInput(reply.id)">回复</span>-->
<!--                    </div>-->
<!--                    &lt;!&ndash; 删除、举报图标按钮 &ndash;&gt;-->
<!--                    <div class="del-com">-->
<!--                      &lt;!&ndash; 删除留言、举报回复 &ndash;&gt;-->
<!--                      <el-tooltip placement="top">-->
<!--                        <div slot="content">-->
<!--                          &lt;!&ndash; 删除留言 &ndash;&gt;-->
<!--                          <p v-if="userId === reply.fromUserId" class="do-com"-->
<!--                             @click="removeReplyById(item.id,reply.id,item.replyCount)">删除</p>-->
<!--                          &lt;!&ndash; 举报留言 &ndash;&gt;-->
<!--                          <p v-if="userId !== reply.fromUserId" class="do-com" @click="reportReplyOpen(reply.id)">举报</p>-->
<!--                        </div>-->
<!--                        &lt;!&ndash; 。。。 &ndash;&gt;-->
<!--                        <i class="el-icon-more-outline"/>-->
<!--                      </el-tooltip>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              &lt;!&ndash; 3、新增@某人-表单 &ndash;&gt;-->
<!--              <el-form class="form" :model="replyData" v-show="targetIndex===reply.id">-->
<!--                &lt;!&ndash; 当前用户头像 &ndash;&gt;-->
<!--                <nuxt-link :to="'/user/'+userId" v-if="userId">-->
<!--                  <img :src="avatar" alt="" lazy>-->
<!--                </nuxt-link>-->
<!--                &lt;!&ndash; maxRows: 10  &ndash;&gt;-->
<!--                <el-input-->
<!--                  maxlength="1000"-->
<!--                  type="textarea"-->
<!--                  :autosize="{ minRows: 2}"-->
<!--                  clearable-->
<!--                  :placeholder="'@ '+reply.fromUsername"-->
<!--                  v-model="replyData.content"-->
<!--                  @keyup.enter.native="addReplyTarget(item.id,replyData.content,reply.id,reply.fromUserId,item.replyCount)">-->
<!--                </el-input>-->
<!--                <el-button type="primary"-->
<!--                           @click="addReplyTarget(item.id,replyData.content,reply.id,reply.fromUserId,item.replyCount)">-->
<!--                  <p class="mb2">发表</p>-->
<!--                  <p>回复</p>-->
<!--                </el-button>-->
<!--              </el-form>-->
<!--              &lt;!&ndash; 新增举报回复 &ndash;&gt;-->
<!--              <div class="report-comment-box" v-show="reportReplyIndex===reply.id">-->
<!--                <h1>举报回复</h1>-->
<!--                <p>举报回复内容：</p>-->
<!--                <p class="red mb20"> {{ reply.content }}</p>-->
<!--                <p class="mb10">本回复发布人：{{ reply.fromUsername }}</p>-->
<!--                <p class="mb10">举报类型：</p>-->
<!--                <el-form-->
<!--                  :model="reportCommentData"-->
<!--                  label-width="100px"-->
<!--                  label-position="top"-->
<!--                  status-icon>-->
<!--                  <el-form-item label="" prop="reportType">-->
<!--                    <el-radio-group v-model="reportCommentData.reportType" size="small">-->
<!--                      <el-radio-button :label="0">作品侵权</el-radio-button>-->
<!--                      <el-radio-button :label="1">涉嫌违法</el-radio-button>-->
<!--                      <el-radio-button :label="2">内容不雅</el-radio-button>-->
<!--                      <el-radio-button :label="3">骚扰谩骂</el-radio-button>-->
<!--                      <el-radio-button :label="4">广告欺诈</el-radio-button>-->
<!--                      <el-radio-button :label="5">低质灌水</el-radio-button>-->
<!--                      <el-radio-button :label="6">其它</el-radio-button>-->
<!--                    </el-radio-group>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="补充说明：" prop="explain">-->
<!--                    <el-input type="textarea" :rows="3" v-model="reportCommentData.description" maxlength="500"-->
<!--                              clearable-->
<!--                              @keyup.enter.native="addReportReply(2,reply.id,reply.content,reply.fromUserId)"/>-->
<!--                  </el-form-item>-->
<!--                  <p>站务会尽快处理您的举报，处理结果，请留意站内通知!</p>-->
<!--                  <p>感谢您为共建文明社区付出!</p>-->
<!--                  <br>-->
<!--                  <el-form-item align="right">-->
<!--                    <el-button @click="reportReplyOpen(reply.id)">取消</el-button>-->
<!--                    <el-button type="primary" @click="addReportReply(2,reply.id,reply.content,reply.fromUserId)">提交-->
<!--                    </el-button>-->
<!--                  </el-form-item>-->
<!--                </el-form>-->
<!--              </div>-->
<!--              &lt;!&ndash; /新增举报回复 &ndash;&gt;-->
<!--            </li>-->
<!--            &lt;!&ndash; 回复列表-分页 &ndash;&gt;-->
<!--            <li v-for="reply in replyList.records" v-if="item.id === replyList.commentId" :key="reply.id">-->
<!--              <div class="reply-box">-->
<!--                <nuxt-link :to="'/user/'+reply.fromUserId">-->
<!--                  <img :src="reply.fromAvatar" alt="" lazy>-->
<!--                </nuxt-link>-->
<!--                <div class="rep-content">-->
<!--                  <nuxt-link :to="'/user/'+reply.fromUserId">-->
<!--                    <span class="from-username">{{ reply.fromUsername }} </span>-->
<!--                    <el-divider direction="vertical" v-if="reply.fromUserId === authorId"/>-->
<!--                    <p v-if="reply.fromUserId === authorId" class="author3"> 作者 </p>-->
<!--                  </nuxt-link>-->
<!--                  <el-divider direction="vertical"/>-->
<!--                  <nuxt-link :to="'/user/'+reply.toUserId" v-if="reply.commentId != reply.rootId">-->
<!--                    <span class="rep-username"> 回复 <span style="color: #00a1d6;font-size: 14px;"> @{{-->
<!--                        reply.toUsername-->
<!--                      }} </span> </span>-->
<!--                    <el-divider direction="vertical"/>-->
<!--                  </nuxt-link>-->
<!--                  <span class="fs14">{{ reply.content }}</span>-->
<!--                  <div class="time">-->
<!--                    <div class="rep-top3-time">-->
<!--                      <span>{{ reply.createTime }}</span>-->
<!--                      <el-divider direction="vertical"/>-->
<!--                      &lt;!&ndash; 点赞回复：根据条件显示不同的样式 userThumb ，调用同一个接口，包含点赞与取消点赞 &ndash;&gt;-->
<!--                      <span v-if="reply.userThumb"-->
<!--                            @click="addReplyThumb(reply.id,reply.fromUserId,item.id,item.replyCount)">-->
<!--                                                        <i class="iconfont icon-icon_dianzan-mian"/> {{-->
<!--                          reply.thumbCount-->
<!--                        }} </span>-->
<!--                      <span v-else @click="addReplyThumb(reply.id,reply.fromUserId,item.id,item.replyCount)">-->
<!--                                                        <i class="iconfont icon-zan1"/> {{-->
<!--                          reply.thumbCount-->
<!--                        }} </span>-->
<!--                      <el-divider direction="vertical"/>-->
<!--                      <span @click="openReplyTargetInput(reply.id)">回复</span>-->
<!--                    </div>-->
<!--                    &lt;!&ndash; 删除、举报图标按钮 &ndash;&gt;-->
<!--                    <div class="del-com">-->
<!--                      &lt;!&ndash; 删除、举报回复 &ndash;&gt;-->
<!--                      <el-tooltip placement="top">-->
<!--                        <div slot="content">-->
<!--                          &lt;!&ndash; 删除回复 &ndash;&gt;-->
<!--                          <p v-if="userId === reply.fromUserId" class="do-com"-->
<!--                             @click="removeReplyById(item.id,reply.id,item.replyCount)">删除</p>-->
<!--                          &lt;!&ndash; 举报回复 &ndash;&gt;-->
<!--                          <p v-if="userId !== reply.fromUserId" class="do-com" @click="reportReplyOpen(reply.id)">举报</p>-->
<!--                        </div>-->
<!--                        &lt;!&ndash; 。。。 &ndash;&gt;-->
<!--                        <i class="el-icon-more-outline"/>-->
<!--                      </el-tooltip>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              &lt;!&ndash; 3、新增@某人-表单 &ndash;&gt;-->
<!--              <el-form class="form" :model="replyData" v-show="targetIndex===reply.id">-->
<!--                &lt;!&ndash; 当前用户头像 &ndash;&gt;-->
<!--                <nuxt-link :to="'/user/'+userId" v-if="userId">-->
<!--                  <img :src="avatar" alt="" lazy>-->
<!--                </nuxt-link>-->
<!--                &lt;!&ndash; maxRows: 10  &ndash;&gt;-->
<!--                <el-input-->
<!--                  maxlength="1000"-->
<!--                  type="textarea"-->
<!--                  :autosize="{ minRows: 2}"-->
<!--                  clearable-->
<!--                  :placeholder="'@ '+reply.fromUsername"-->
<!--                  v-model="replyData.content"-->
<!--                  @keyup.enter.native="addReplyTarget(item.id,replyData.content,reply.id,reply.fromUserId,item.replyCount)">-->
<!--                </el-input>-->
<!--                <el-button v-if="authorId" type="primary" @click="addReplyTarget(item.id,replyData.content,reply.id,reply.fromUserId,item.replyCount)"><p class="mb2">发表</p><p>回复</p></el-button>-->
<!--                <el-button v-else type="primary"><p class="mb2">发表</p><p>回复</p></el-button>-->
<!--              </el-form>-->
<!--              &lt;!&ndash; 新增举报回复 &ndash;&gt;-->
<!--              <div class="report-comment-box" v-show="reportReplyIndex===reply.id">-->
<!--                <h1>举报回复</h1>-->
<!--                <el-divider/>-->
<!--                <p>举报回复内容：</p>-->
<!--                <p class="red"> {{ reply.content }}</p>-->
<!--                <el-divider/>-->
<!--                <p>回复发布人：{{ reply.fromUsername }}</p>-->
<!--                <el-divider/>-->
<!--                <el-form-->
<!--                  :model="reportCommentData"-->
<!--                  label-width="100px"-->
<!--                  label-position="top"-->
<!--                  status-icon>-->
<!--                  <el-form-item label="举报类型：" prop="reportType">-->
<!--                    <el-radio-group v-model="reportCommentData.reportType" size="small">-->
<!--                      <el-radio-button :label="0">作品侵权</el-radio-button>-->
<!--                      <el-radio-button :label="1">涉嫌违法</el-radio-button>-->
<!--                      <el-radio-button :label="2">内容不雅</el-radio-button>-->
<!--                      <el-radio-button :label="3">骚扰谩骂</el-radio-button>-->
<!--                      <el-radio-button :label="4">广告欺诈</el-radio-button>-->
<!--                      <el-radio-button :label="5">低质灌水</el-radio-button>-->
<!--                      <el-radio-button :label="6">其它</el-radio-button>-->
<!--                    </el-radio-group>-->
<!--                  </el-form-item>-->
<!--                  <el-divider/>-->
<!--                  <el-form-item label="补充说明：" prop="explain">-->
<!--                    <el-input type="textarea" :rows="3" v-model="reportCommentData.description" maxlength="500"-->
<!--                              clearable/>-->
<!--                  </el-form-item>-->
<!--                  <el-divider/>-->
<!--                  <p>站务会尽快处理您的举报，处理结果，请留意站内通知!</p>-->
<!--                  <p>感谢您为共建文明社区付出!</p>-->
<!--                  <br>-->
<!--                  <el-form-item align="right">-->
<!--                    <el-button @click="reportReplyOpen(reply.id)">取消</el-button>-->
<!--                    <el-button type="primary">提交</el-button>-->
<!--                  </el-form-item>-->
<!--                </el-form>-->
<!--              </div>-->
<!--              &lt;!&ndash; /新增举报回复 &ndash;&gt;-->
<!--            </li>-->
<!--            &lt;!&ndash; 点击查看-前10条回复&ndash;&gt;-->
<!--            <template>-->
<!--              <span class="reply-count" v-if="item.replyCount >3 && item.id != commentId">-->
<!--                共 {{ item.replyCount }} 条回复 </span>-->
<!--              <span class="see-more-reply" @click="handleReplyTopTen(item.id)"-->
<!--                    v-if="item.replyCount >3 && item.id != commentId"> 点击查看</span>-->
<!--            </template>-->
<!--            &lt;!&ndash; 分页器-回复列表 &ndash;&gt;-->
<!--            <div v-if="item.id === replyList.commentId">-->
<!--              <el-pagination-->
<!--                small-->
<!--                background-->
<!--                v-if="item.replyCount > 10"-->
<!--                @current-change="handleReplyCurrentChange(item.id)"-->
<!--                :current-page.sync="currentPage"-->
<!--                :page-size="replySize"-->
<!--                layout="total, prev, pager, next"-->
<!--                :total=" item.replyCount">-->
<!--              </el-pagination>-->
<!--            </div>-->
<!--          </ul>-->
<!--          <el-divider class="md-hidden"/>-->
<!--        </li>-->
<!--        &lt;!&ndash; 留言分页组件 开始 &ndash;&gt;-->
<!--        <template>-->
<!--          &lt;!&ndash; md 分页组件 开始 &ndash;&gt;-->
<!--          <el-pagination-->
<!--            class="sm-hidden c-pagination"-->
<!--            background-->
<!--            @current-change="handleCurrentChange"-->
<!--            :current-page="current"-->
<!--            :page-size="size"-->
<!--            layout="total, prev, pager, next, jumper"-->
<!--            :total="Number(total)">-->
<!--          </el-pagination>-->
<!--          &lt;!&ndash; sm 分页组件 开始 &ndash;&gt;-->
<!--          <el-pagination-->
<!--            class="md-hidden c-pagination"-->
<!--            small-->
<!--            background-->
<!--            @current-change="handleCurrentChange"-->
<!--            :current-page="current"-->
<!--            :page-size="size"-->
<!--            layout="total,prev, pager, next"-->
<!--            :total="Number(total)">-->
<!--          </el-pagination>-->
<!--        </template>-->
<!--        &lt;!&ndash; /分页组件 结束 &ndash;&gt;-->
<!--      </ul>-->
<!--      &lt;!&ndash; /一二级留言展示区 &ndash;&gt;-->
<!--    </div>-->
<!--  </div>-->
<!--  &lt;!&ndash; /留言区&ndash;&gt;-->
<!--</template>-->
<!--<script>-->

<!--export default {-->
<!--  name: "article-comment",-->
<!--  props: ["userId", "authorId", "avatar", "current", "size", "searchObj", "total", "commentList",-->
<!--    "commentData", "replyData", "replyCurrent", "replySize", "replyList", "targetData", "reportCommentData"],-->
<!--  data() {-->
<!--    return {-->
<!--      activeIndex: -1,  // 显示或隐藏一级回复输入框-->
<!--      // 动态改变弹窗的尺寸用-->
<!--      dialogWidth: '0',-->
<!--      // 举报留言-->
<!--      reportCommentIndex: -1,-->
<!--      // 举报回复-->
<!--      reportReplyIndex: -1,-->
<!--      currentPage: 0,-->
<!--      commentId: 0,-->
<!--      targetIndex: -1  // 显示或隐藏@某人回复输入框-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    replyCurrent(newValue, oldValue) {-->
<!--      this.currentPage = newValue-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    // 回复-查询前10条记录-->
<!--    handleReplyTopTen(commentId) {-->
<!--      this.commentId = commentId-->
<!--      this.$emit('handleReplyTopTen', commentId)-->
<!--    },-->
<!--    // 回复-切换分页-->
<!--    handleReplyCurrentChange(commentId) {-->
<!--      this.commentId = commentId-->
<!--      this.$emit('handleReplyCurrentChange', this.currentPage, commentId)-->
<!--    },-->
<!--    // 回复-打开新增回复输入框-->
<!--    openAddReplyBox(index) {-->
<!--      this.activeIndex = this.activeIndex === index ? -1 : index;-->
<!--    },-->
<!--    // 回复-新增（replyCount 评论表的回复总数，为了控制调用哪个接口）-->
<!--    addReply(commentId, content, rootId, toUserId, replyCount, index) {-->
<!--      this.$emit('addReply', commentId, content, rootId, toUserId, replyCount)-->
<!--      this.activeIndex = this.activeIndex === index ? -1 : index;-->
<!--    },-->
<!--    // 回复-新增@某人回复（复用新增回复接口，组装不同数据）-->
<!--    addReplyTarget(commentId, content, rootId, toUserId, replyCount) {-->
<!--      this.$emit('addReply', commentId, content, rootId, toUserId, replyCount)-->
<!--      this.targetIndex = this.targetIndex === rootId ? -1 : rootId;-->
<!--    },-->
<!--    // 留言-条件查询-时间倒序-->
<!--    searchCreateTime() {-->
<!--      this.$emit('searchCreateTime')-->
<!--    },-->
<!--    // 留言-条件查询-点赞数倒序-->
<!--    searchThumbCount() {-->
<!--      this.$emit('searchThumbCount')-->
<!--    },-->
<!--    // 留言-切换分页-->
<!--    handleCurrentChange(current) {-->
<!--      this.$emit('handleCurrentChange', current)-->
<!--    },-->
<!--    // 留言-新增-->
<!--    addComment() {-->
<!--      if (this.userId === 0) {-->
<!--        this.$message.info("功能展示")-->
<!--        return-->
<!--      }-->
<!--      this.$emit('addComment', this.commentData.content)-->
<!--    },-->
<!--    // 点赞-留言-->
<!--    addCommentThumb(entityId, entityUserId) {-->
<!--      if (this.userId === 0) {-->
<!--        this.$message.info("功能展示")-->
<!--        return-->
<!--      }-->
<!--      this.$emit('addCommentThumb', entityId, entityUserId)-->
<!--    },-->
<!--    // 点赞-回复（ commentId, replyCount 用于条件判断刷新那个接口 ）-->
<!--    addReplyThumb(entityId, entityUserId, commentId, replyCount) {-->
<!--      this.$emit('addReplyThumb', entityId, entityUserId, commentId, replyCount)-->
<!--    },-->
<!--    // 举报-打开举报回复框-->
<!--    reportReplyOpen(id) {-->
<!--      // if (this.userId) {-->
<!--      this.reportCommentData.reportType = '';-->
<!--      this.reportCommentData.description = ''-->
<!--      this.reportReplyIndex = this.reportReplyIndex === id ? -1 : id;-->
<!--    },-->
<!--    // 举报-提交举报留言表单-->
<!--    addReportReply(entityType, entityId, content, entityUserId) {-->
<!--      // 触发父组件方法-->
<!--      this.$emit('addReportComment', this.reportCommentData, entityType, entityId, content, entityUserId);-->
<!--      this.reportReplyIndex = this.reportReplyIndex === entityId ? -1 : entityId;-->
<!--    },-->
<!--    // 举报-打开举报留言框-->
<!--    openOrCloseReportComment(index) {-->
<!--      if (this.userId) {-->
<!--        this.reportCommentData.reportType = ''-->
<!--        this.reportCommentData.description = ''-->
<!--        this.reportCommentIndex = this.reportCommentIndex === index ? -1 : index;-->
<!--      } else {-->
<!--        window.location.href = (`/auth/login?redirectURL=` + window.location.href)-->
<!--      }-->
<!--    },-->
<!--    // 举报-提交举报留言表单-->
<!--    addReportComment(index, entityType, entityId, content, entityUserId) {-->
<!--      // 触发父组件方法-->
<!--      this.$emit('addReportComment', this.reportCommentData, entityType, entityId, content, entityUserId);-->
<!--      this.reportCommentIndex = this.reportCommentIndex === index ? -1 : index;-->
<!--    },-->
<!--    // 打开 @某人回复框-->
<!--    openReplyTargetInput(id) {-->
<!--      this.targetIndex = this.targetIndex === id ? -1 : id;-->
<!--    },-->
<!--    // 根据ID删除留言和对应的所有回复-->
<!--    removeCommentById(id) {-->
<!--      this.$emit('removeCommentById', id)-->
<!--    },-->
<!--    // 回复-根据回复ID删除回复-对应留言回复数 - 1(传当前评论ID和评论总数，为了根据条件刷新回复列表）-->
<!--    removeReplyById(commentId, replyId, replyCount) {-->
<!--      this.$emit('removeReplyById', commentId, replyId, replyCount)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style lang="less">-->

<!--.el-icon-wind-power:hover {-->
<!--  cursor: pointer;-->
<!--}-->

<!--// 已赞-->
<!--.icon-icon_dianzan-mian {-->
<!--  color: #747474;-->
<!--}-->

<!--// 分页器-->
<!--.el-pagination {-->
<!--  padding: 10px 0 50px;-->
<!--}-->

<!--// 公共样式-留言区最外层容器-->
<!--.comment-box {-->
<!--  margin-top: 20px;-->
<!--  border-radius: 4px;-->
<!--  background-color: #FFFFFF !important;-->

<!--  // 当前用户头像，一级留言发表框左则-->
<!--  img {-->
<!--    width: 60px;-->
<!--    height: 60px;-->
<!--    border-radius: 50%;-->
<!--    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);-->
<!--    transition: all .4s ease-in-out;-->
<!--    -webkit-transition: all .4s ease-in-out;-->
<!--    object-fit: cover;-->
<!--  }-->

<!--  img:hover {-->
<!--    transform: rotate(360deg);-->
<!--    -webkit-transform: rotate(360deg);-->
<!--  }-->

<!--  .add-one {-->
<!--    border-radius: 4px;-->
<!--    background-color: #FFFFFF;-->

<!--    div {-->
<!--      .el-form {-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  // 一级留言内容区-->
<!--  .com-one-content {-->
<!--    display: flex;-->

<!--    .author-span {-->
<!--      font-size: 14px;-->
<!--      color: #6b6f76;-->
<!--    }-->

<!--    .right {-->
<!--      width: 100%;-->
<!--      margin: 10px 0 0 20px;-->

<!--      .author {-->
<!--        display: inline-block;-->
<!--        font-size: 12px;-->
<!--        color: #00a1d6;-->
<!--      }-->

<!--      .item-content {-->
<!--        padding-right: 10px;-->
<!--        margin-top: 5px;-->
<!--        font-size: 14px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  // 回复列表框-->
<!--  .rep-content {-->
<!--    padding-right: 10px;-->
<!--    line-height: 22px;-->
<!--    font-size: 14px;-->

<!--    .from-username {-->
<!--      font-size: 14px;-->
<!--      font-weight: bold;-->
<!--      color: #4d4e50;-->
<!--    }-->

<!--    .author-reply {-->
<!--      display: inline-block;-->
<!--      font-size: 12px;-->
<!--      color: #00a1d6;-->
<!--    }-->

<!--    .author3 {-->
<!--      display: inline-block;-->
<!--      font-size: 12px;-->
<!--      color: #00a1d6;-->
<!--    }-->
<!--  }-->

<!--  // 回复总数（点击查看更多前面）-->
<!--  .reply-count {-->
<!--    display: inline-block;-->
<!--    margin-bottom: 30px;-->
<!--    font-size: 12px;-->
<!--    color: #726f70;-->
<!--  }-->

<!--  // 点击查看更多-->
<!--  .see-more-reply {-->
<!--    padding: 2px 3px;-->
<!--    font-size: 12px;-->
<!--    color: #00a1d6;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  // 点击查看更多-->
<!--  .see-more-reply:hover {-->
<!--    border-radius: 4px;-->
<!--    background-color: #FFFFFF;-->
<!--  }-->

<!--  // 留言框-->
<!--  .li {-->
<!--    padding-bottom: 20px;-->
<!--  }-->

<!--  .time {-->
<!--    .del-com {-->
<!--      margin-top: 12px;-->
<!--      margin-right: 10px;-->
<!--    }-->
<!--  }-->

<!--  // 留言时间-->
<!--  .com-time {-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    margin: 10px 0 20px;-->
<!--    font-size: 13px;-->
<!--    color: #666971;-->
<!--  }-->

<!--  // 删除、举报留言按钮-->
<!--  .do-com {-->
<!--    margin-bottom: 10px;-->
<!--    font-size: 18px;-->
<!--  }-->

<!--  // 发表留言、回复按钮文字间距-->
<!--  .mb2 {-->
<!--    margin-bottom: 2px;-->
<!--  }-->

<!--  // 举报留言框-->
<!--  .report-comment-box {-->
<!--    font-size: 16px;-->
<!--    border-radius: 4px;-->
<!--    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);-->

<!--    .rp-con, .red {-->
<!--      color: #900330;-->
<!--    }-->

<!--    .el-form {-->
<!--      p {-->
<!--        text-align: center;-->
<!--        font-size: 14px;-->
<!--        color: #4d5158;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--// md-->
<!--@media screen and (min-width: 960px) {-->

<!--  // 留言区最外层容器-->
<!--  .comment-box {-->
<!--    width: 90%;-->

<!--    .in-box {-->
<!--      padding: 0 100px-->
<!--    }-->

<!--    > h1 {-->
<!--      margin: 0 0 20px 20px;-->
<!--    }-->

<!--    // 排序文字激活样式-->
<!--    .orderActive {-->
<!--      padding: 8px 10px;-->
<!--      border-radius: 4px;-->
<!--      color: #e5e3e3;-->
<!--      font-weight: bold;-->
<!--      background-color: #262525;-->
<!--    }-->

<!--    // 新增一级留言-->
<!--    .add-one {-->
<!--      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);-->

<!--      div {-->
<!--        padding: 20px 0;-->

<!--        .el-form {-->
<!--          padding: 30px 50px;-->

<!--          img {-->
<!--            margin-right: 10px;-->
<!--          }-->
<!--        }-->
<!--      }-->

<!--      .add-com-btn {-->
<!--        margin-left: 10px;-->
<!--      }-->
<!--    }-->

<!--    // 一二级留言展示区-->
<!--    .com-one {-->
<!--      margin-top: 20px;-->
<!--      border-radius: 4px;-->

<!--      .li {-->
<!--        margin-bottom: 20px;-->
<!--        padding-top: 20px;-->
<!--        border-radius: 4px;-->
<!--        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);-->
<!--      }-->

<!--      // 排序-->
<!--      .order {-->
<!--        margin: 50px 0 20px 0;-->

<!--        span {-->
<!--          margin-right: 5px;-->
<!--          font-size: 16px;-->
<!--          font-weight: bold;-->
<!--        }-->

<!--        span:hover {-->
<!--          cursor: pointer;-->
<!--        }-->
<!--      }-->

<!--      // 一级留言内容区-->
<!--      .com-one-content {-->
<!--        padding: 0 50px;-->
<!--      }-->

<!--      // 新增回复框-->
<!--      .form {-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        margin-left: 50px;-->
<!--        padding: 10px;-->

<!--        img {-->
<!--          margin-right: 8px;-->
<!--        }-->

<!--        .el-button {-->
<!--          margin-left: 3px;-->
<!--        }-->
<!--      }-->

<!--      .c-pagination {-->
<!--        padding: 30px 0 0;-->
<!--      }-->
<!--    }-->

<!--    // 二级留言内容展示区-->
<!--    .com-two {-->
<!--      padding-right: 35px;-->
<!--      margin-top: 10px;-->
<!--      margin-left: 70px;-->

<!--      li {-->
<!--        margin-bottom: 10px;-->

<!--        .reply-box {-->
<!--          display: flex;-->
<!--          margin-left: 40px;-->

<!--          .rep-content {-->
<!--            width: 90%;-->
<!--          }-->

<!--          .rep-username {-->
<!--            font-size: 12px;-->
<!--          }-->

<!--          // 回复列表小头像-->
<!--          img {-->
<!--            height: 40px;-->
<!--            width: 40px;-->
<!--            margin-right: 20px;-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .time {-->
<!--      display: flex;-->
<!--      justify-content: space-between;-->
<!--      margin: 10px 0 5px;-->
<!--      color: #666971;-->
<!--      font-size: 13px;-->
<!--    }-->

<!--    .rep-top3-time {-->
<!--      margin-bottom: 20px;-->
<!--    }-->

<!--    // 举报留言框-->
<!--    .report-comment-box {-->
<!--      width: 80%;-->
<!--      margin: 20px auto;-->
<!--      padding: 20px 50px 50px;-->
<!--    }-->

<!--    // 回复总数，点击查看更多-->
<!--    .reply-count {-->
<!--      margin-left: 90px;-->
<!--      padding-bottom: 20px;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--// sm-->
<!--@media screen and (max-width: 960px) {-->

<!--  // 留言区最外层容器-->
<!--  .comment-box {-->

<!--    h1 {-->
<!--      padding-top: 30px;-->
<!--      padding-left: 10px;-->
<!--    }-->

<!--    // 排序-->
<!--    .order {-->
<!--      font-size: 16px;-->
<!--      margin: 50px 0 30px;-->

<!--      // 排序文字激活样式-->
<!--      .orderActive {-->
<!--        padding: 5px 8px;-->
<!--        color: #d9d7d7;-->
<!--        font-weight: bold;-->
<!--        background-color: black;-->
<!--        border-radius: 4px;-->
<!--      }-->
<!--    }-->

<!--    .add-one {-->
<!--      width: 100%;-->
<!--      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);-->

<!--      div {-->
<!--        padding: 20px 10px;-->
<!--      }-->
<!--    }-->

<!--    // 一二级留言展示区-->
<!--    .com-one {-->
<!--      margin-top: 20px;-->
<!--      border-radius: 4px;-->

<!--      .li {-->
<!--        width: 95%;-->
<!--        padding: 20px 10px 0;-->
<!--        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);-->
<!--        border-radius: 4px;-->
<!--      }-->

<!--      .order {-->
<!--        display: flex;-->
<!--        margin-left: 20px;-->

<!--        li {-->
<!--          margin-bottom: 10px;-->
<!--          font-size: 16px;-->
<!--          font-weight: bold;-->

<!--          span {-->
<!--            margin-right: 5px;-->
<!--          }-->

<!--          span:hover {-->
<!--            cursor: pointer;-->
<!--          }-->
<!--        }-->
<!--      }-->

<!--      // 留言内容区-->
<!--      .com-one-content {-->
<!--        padding: 20px 10px 0 0;-->
<!--      }-->

<!--      // 新增回复框-->
<!--      .form {-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        padding: 10px;-->
<!--      }-->

<!--      // 二级留言-->
<!--      li {-->
<!--        .reply-box {-->
<!--          display: flex;-->
<!--          padding-left: 28px;-->

<!--          img {-->
<!--            height: 40px;-->
<!--            width: 40px;-->
<!--            margin-right: 20px;-->
<!--          }-->
<!--        }-->

<!--        .rep-content {-->
<!--          width: 100%;-->
<!--        }-->
<!--      }-->

<!--      // 回复总数，点击查看更多-->
<!--      .reply-count {-->
<!--        margin-top: 20px;-->
<!--        margin-left: 76px;-->
<!--      }-->
<!--    }-->

<!--    .time {-->
<!--      display: flex;-->
<!--      justify-content: space-between;-->
<!--      color: #666971;-->
<!--      font-size: 13px;-->

<!--      .rep-top3-time {-->
<!--        margin: 10px 0 20px;-->
<!--      }-->
<!--    }-->

<!--    // 回复列表时间-->
<!--    .reply-time {-->
<!--      margin: 10px 0 20px;-->
<!--    }-->

<!--    // 回复分页器-->
<!--    .r-pagination {-->
<!--      text-align: center;-->
<!--    }-->

<!--    // 举报留言框-->
<!--    .report-comment-box {-->
<!--      width: 92%;-->
<!--      margin: 20px auto;-->
<!--      padding: 10px 10px 50px;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
