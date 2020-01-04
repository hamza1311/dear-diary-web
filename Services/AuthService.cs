using System;
using System.Net.Http;
using System.Threading.Tasks;
using DearDiary.Models;
using Microsoft.JSInterop;

namespace DearDiary.Services
{
    public static class AuthService
    {
        public static async Task<User> Login(LoginCredentials credentials, IJSRuntime jsRuntime)
        {
            var user = await jsRuntime.InvokeAsync<User>("login", credentials);
            return user;
        }

        public static async Task<User> GetCurrentUser(IJSRuntime jsRuntime)
        {
            return await jsRuntime.InvokeAsync<User>("currentUser");
        }

        public static async Task Logout(IJSRuntime jsRuntime)
        {
            await jsRuntime.InvokeVoidAsync("logout");
        }
    }
}
