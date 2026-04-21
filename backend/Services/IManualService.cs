using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Controllers;
using backend.DTOs;

namespace backend.Services
{
    public interface IManualService
    {
        IEnumerable<ManualDto> GetManuals();
        object? GetManualById(int id);
        object CreateManual(string manualName, string systemName, string status, int? createdBy, int id = 0);
        bool DeleteManual(int id);
        bool DeleteManuals(List<int> ids);
        bool ReorderManuals(List<ReorderRequest> items);
    }
}
