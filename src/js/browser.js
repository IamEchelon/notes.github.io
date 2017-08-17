export const browser = {
  navSelect(browser) {
    return navigator.userAgent.match(browser)
  },

  android() {
    return this.navSelect(/Android/i)
  },

  iphone() {
    return this.navSelect(/iPhone/i)
  },

  ipad() {
    return this.navSelect(/iPad/i)
  }
}
