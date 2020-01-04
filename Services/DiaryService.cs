using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace DearDiary.Services
{
    public static class DiaryService
    {
        public static async Task<List<DiaryItem>> GetAll(IJSRuntime jSRuntime)
        {
            var items = await jSRuntime.InvokeAsync<List<DiaryItem>>("getAllItems");
            return items;
        }

        public static async Task<DiaryItem> Get(string id, IJSRuntime jSRuntime)
        {
            var item = await jSRuntime.InvokeAsync<DiaryItem>("getItemById", id);
            return item;
        }

        public static async Task<DiaryItem> Create(DiaryItem item, IJSRuntime jSRuntime)
        {
            var newItem = await jSRuntime.InvokeAsync<DiaryItem>("createItem", item);
            return newItem;
        }
        
    }
}
