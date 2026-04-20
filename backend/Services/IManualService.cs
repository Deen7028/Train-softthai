using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Controllers;
using backend.DTOs;

namespace backend.Services
{
    public interface IManualService
    {
        Task<IEnumerable<ManualDto>> GetManualsAsync();
        Task<object?> GetManualByIdAsync(int id);
        Task<object> CreateManualAsync(string manualName, string systemName, string status, int? createdBy, int id = 0);
        Task<object?> UpdateManualAsync(int id, UpdateManual request);
        Task<bool> DeleteManualAsync(int id);
        Task<bool> DeleteManualsAsync(List<int> ids);
        Task<bool> ReorderManualsAsync(List<ReorderRequest> items);
    }
}
