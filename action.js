var app = new Vue({
  el: '#app',
  props: {
    value: String
  },
  data: {
    lists: [],
    id: 0,　//タスクユニークID
    newItem: '',
    limit: '',
    state: [
      { value: -1, name: '未着手', active: false },
      { value: 0, name: '進行中', active: false },
      { value: 1, name: '完了', active: false }
    ],
    current: new Date(),
    mode: 'single',
    formats: {
      input: ['YYYY-MM-DD'],
    },
    weeklyInterval: 1,
    selectedDate: new Date(),
    bgActive: false,
    done: false,
    over: false,
    sortValue: -1,
    selectAll: true,
    deadActive: false
  },
  methods: {
    addItem: function (e)
    {
      if (this.newItem == '') return
      this.lists.push({
        itemId: ++this.id,
        itemName: this.newItem,
        state: this.state[0],//登録時初期値 = 未着手
        selectedDate: this.selectedDate,
        currentDate: this.current,//タスクを追加された日
        limit: this.limitCalc(),
        show: false, //編集画面
        bgActive: this.bgActive,
        done: this.done,
        over: this.over,
        deadActive: this.deadActive
      })
      this.newItem = ''
      this.selectedDate = this.current
    },
    btnClick: function (process)
    {
      this.sortValue = process.value
      this.state.value = process.value
      for (var i = 0; i < 3; i++)
      {
        this.state[i].active = false
      }
      process.active = !process.active
      this.selectAll = false
    },
    clickBtnAll: function ()
    {
      this.selectAll = !this.selectAll
      for (var i = 0; i < 3; i++)
      {
        this.state[i].active = false
      }
    },
    dedLineBtn: function ()
    {
      this.deadActive = !this.deadActive
      console.log(this.deadActive)
    },
    deleteItem: function (index)
    { //リスト削除
      if (confirm('《' + this.lists[index].itemName + '》を削除しますか？'))
      {
        this.lists.splice(index, 1);
      }
    },
    editItem: function (list)
    {//編集画面
      list.show = true
      this.bgActive = !this.bgActive//モーダル用背景
    },
    doneEdit: function (list)
    {
      list.show = false
      this.bgActive = !this.bgActive
    },
    doneCheck: function (list)
    { //ステータス完了時に色を塗る
      if (list.state.name == "完了")
      {
        list.done = !list.done
      } else
      {
        list.done = false
      }
    },
    limitCalc: function (list)
    { //残りの日を計算
      if (list == undefined)
      {
        //新規追加時の処理
        return this.limit = Math.ceil((this.selectedDate - this.current) / 86400000)
      } else
      {
        //編集時の処理
        return list.limit = Math.ceil((list.selectedDate - list.currentDate) / 86400000)
      }
    },
    overFunc: function (list)
    {
      //期限切れ
      if (list.limit < 0)
      {
        list.over = true
      } else
      {
        list.over = false
      }
    }
  },
  computed: { //状態絞り込み
    filtering: function ()
    {
      return this.lists.filter(function (elm)
      {
        if (elm.show == false)
        { //編集画面非表示時のみ
          if (this.selectAll == true)
          {
            return elm
          }
          return elm.state.value == this.sortValue
        } else
        {
          return elm
        }
      }, this)
    },
    deadLineCross: function ()
    {
      return this.filtering.filter(function (elm)
      {
        //期限ソートボタンを押されたか判定
        if (this.deadActive == true) // true = ソートボタン押された状態
        {
          return elm.limit < 3 //残３日未満を返却
        } else
        {
          return elm //リストをそのまま表示
        }
      }, this)
    }
  }


})

