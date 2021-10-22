export class Character {
  favorite = false;

  constructor({ id, name, species, gender, image, wiki, born, died, homeworld }) {
    this.id = id;
    this.name = name;
    this.birthYear = born;
    this.gender = gender;
    this.species = species;
    this.homeworld = homeworld || 'Unknown';
    this.image = image;
    this.info = wiki;
    this.diedYear = died;
    this.died = typeof this.diedYear === 'number';
    this.isFavorited();
  }

  get age() {
    if(typeof this.birthYear === 'number') {
      return this.birthYear <= 0 ? Math.abs(this.birthYear) + 'BBY' : Math.abs(this.birthYear) + 'ABY';
    } else {
      return this.birthYear ? this.birthYear : 'Unknown';
    }
  }

  get state() {
    return this.died ? 'died' : 'alive';
  }

  set favorite(value) {
    this.favorite = value;
  }

  saveCharacterId() {
    if(localStorage.getItem('favorited')) {
      const favorited = localStorage.getItem('favorited');
      localStorage.setItem('favorited', favorited + `,${this.id}`);
    } else {
      localStorage.setItem('favorited', this.id);
    }
  }

  unsaveCharacterId() {
    if(localStorage.getItem('favorited')) {
      const favorited = localStorage.getItem('favorited');
      const updated = favorited.split(',').filter(id => +id !== this.id).join(',');
      localStorage.setItem('favorited', updated);
    }
  }

  isFavorited() {
    if(localStorage.getItem('favorited')) {
      const favorited = localStorage.getItem('favorited');
      this.favorite = favorited.split(',').some(id => +id === this.id);
    } else {
      this.favorite = false;
    }
  }
}