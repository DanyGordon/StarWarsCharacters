class Preloader {
  node = null

  constructor() { }

  loadingStart(selector = 'body') {
    const parent = document.querySelector(selector);
    if(!this.node) {
      this.render();
    }
    this.node.style.height = '500px';
    parent.append(this.node);
  }

  loadingFinish(selector = 'body') {
    const parent = document.querySelector(selector)
    parent.contains(this.node) ? parent.removeChild(this.node) : null;
  }

  render() {
    this.node = document.createElement('div');
    this.node.classList.add('preloader-wrapper');
    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    for(let i = 0; i < 4; i++) {
      preloader.append(document.createElement('div'));
    }
    this.node.append(preloader);
  }
}

export const preloader = new Preloader();