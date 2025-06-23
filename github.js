class GitHub {
  constructor() {
    this.apiUrl = "https://api.github.com/users/";
  }

  async getUser(username) {
    const profileResponse = await fetch(`${this.apiUrl}${username}`);
    const profile = await profileResponse.json();
    return { profile }; 
  }
}