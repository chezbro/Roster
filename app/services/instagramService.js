// File: app/services/instagramService.js
export async function fetchInstagramInfo(username) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove @ if present
    username = username.startsWith('@') ? username.slice(1) : username;
    
    // Simulate fetching data
    return {
      username: username,
      fullName: `${username.charAt(0).toUpperCase() + username.slice(1)} Smith`,
      bio: `This is a mock bio for ${username}. I love coding and dating!`,
      profilePicUrl: `https://picsum.photos/seed/${username}/200`
    };
  }