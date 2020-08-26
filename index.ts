function Loading(prototype, key, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function(...args) {
    ++this.loading;
    return fn.call(this, ...args)
      .finally(() => --this.loading);
  };
}

function Debounce(duration: number) {
  return function (prototype, key, descriptor) {
    const fn = descriptor.value;
    let timer;

    descriptor.value = function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => { 
        fn.call(this, ...args);
        timer = null;
      }, duration);
    }
  }
}

class A {
  _loading = 0;

  get loading() {
    return this._loading;
  }
  set loading(l) {
    this._loading = l;
    document.body.innerHTML = this.loading ? '加载中' : '完成';
  }

  @Loading
  fetch() {
    return new Promise(res => setTimeout(res, 3000))
  }

  @Debounce(1000)
  log(text) {
    console.log(text);
  }
}

const a = new A();

document.body.onclick = () => {
  console.log('点击了');
  a.log('触发了');
};
