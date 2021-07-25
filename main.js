const messageListItem = {
  props : ['message'],
  data() {
    return {
      userName: "",
      userId: this.message._user_id,
      text: this.message.text,
      updatedAt: this.message._updated_at
    }
  },
  mounted() {
    axios.get("https://versatileapi.herokuapp.com/api/user/" + this.userId)
      .then((res) => {
        if(res.data.name) {
          this.userName = res.data.name;
        } else {
          this.userName = this.userId;
        }
      })
      .catch((err) => {
        this.userName = this.userId;
      });
  },
  template: `
        <div class="card-body">
          <div class="user-name card-title">
            @{{userName}}
          </div>
          <div class="card-text">
            <div class="text">{{text}}</div>
            <div class="updated-at text-end text-black-50 mt-2">{{updatedAt}}</div>
          </div>
        </div>
`
};

const App = {
  data() {
    return {
      postText: "",
      messages: []
    }
  },
  mounted() {
    this.read();
  },
  methods: {
    read() {
      const self = this;
      axios.get('https://versatileapi.herokuapp.com/api/text/all?$orderby=_created_at desc&$limit=20')
        .then((res) => {
          self.messages = res.data;
        });
    },
    post(e) {
      if(!this.postText) {
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'HelloWorld'
      };
      
      axios.post('https://versatileapi.herokuapp.com/api/text', {text: this.postText}, {headers: headers})
        .then(() => {
          this.postText = "";
          this.read(); // 再読込したかったけどうまく行かない
        })
        .catch((err) => {
          alert("失敗しました");
        });
    }
  },
  components: {
    'message-list-item': messageListItem
  }
};

Vue.createApp(App).mount('#app');
