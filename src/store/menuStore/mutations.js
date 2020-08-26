export const mutations = {

  changeData(state, data) {
    //data: 载荷
    //data.key: 修改数据的名称
    //data.value: 修改的数据

    state[data.key] = data.value;
  },

  //修改商品数据
  changeProducts(state, data) {
    //data: 载荷
    //data.type: 类型
    //data.value: 商品数据
    state.products[data.type] = data.value;
  }

}