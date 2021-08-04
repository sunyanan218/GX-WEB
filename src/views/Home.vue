<template>
  <div class="home">
    <div class="form">
      <el-input
        class="input"
        v-model="robotId"
        placeholder="请输入机器人编号"
      />
      <el-input class="input" v-model="time" placeholder="请输入日期" />
      <el-button @click.prevent="onSearch" type="primary">查询</el-button>
    </div>
    <div class="tasks">
      <table>
        <tr>
          <th>任务编号</th>
          <th>机器人编号</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>开始地点</th>
          <th>结束地点</th>
          <th>操作</th>
        </tr>
        <tr v-for="task in tasks" :key="task.taskid">
          <td>{{ task.taskid }}</td>
          <td>{{ task.robotid }}</td>
          <td>{{ task.begintime }}</td>
          <td>{{ task.endtime }}</td>
          <td>{{ task.startplace }}</td>
          <td>{{ task.endplace }}</td>
          <td
            @click="
              onClickTask(
                task.taskid,
                task.robotid,
                task.begintime,
                task.endtime
              )
            "
            class="taskLine"
          >
            任务路径
          </td>
        </tr>
      </table>
      <p>任务总数:{{ count }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import { fetchTasks } from "@/services/api";

export default {
  name: "Home",
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      tasks: [],
      robotId: "1",
      time: "2021-07-27",
      count: 0,
    };
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    async onSearch() {
      // fetchTasks(
      //   `http://127.0.0.1:5000/get_task?robotid=${this.robotId}&time=${this.time}`
      // ).then((json) => {
      //   const result = JSON.parse(json.result);
      //   this.result = result;
      //   this.tasks = result.data;
      //   this.count = result.taskcount;
      // });

      const json = await fetchTasks(this.robotId, this.time);
      const result = JSON.parse(json.result);
      this.result = result;
      this.tasks = result.data;
      this.count = result.taskcount;
    },
    onClickTask(taskId, robotid, begintime) {
      this.$router.push({
        path: "/map",
        query: {
          robotid,
          taskId,
          begintime,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  background-color: rgb(238, 238, 238);
  padding: 32px;
  display: flex;
  flex-direction: "row";

  .input {
    width: initial;
  }

  div {
    margin-right: 16px;
  }
}

.taskLine {
  cursor: pointer;
  color: blue;
}
</style>
