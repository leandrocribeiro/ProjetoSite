using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class TipoAgendamentoController : ControllerBase
{
    private readonly DataContext context;

    public TipoAgendamentoController(DataContext dc)
    {
        context = dc;
    }

[HttpGet]
public async Task<ActionResult<IEnumerable<TipoAgendamento>>> Get()
{
    try
    {
        // return Ok(await context.TBAgendamento.ToListAsync());
        return Ok(await context.TBAgendamento
        .Include(p => p.TipoUserPaciente)
        .Include(p => p.TipoExame)
        .ToListAsync());
    }
    catch
    {
        return BadRequest("Erro ao listar os Agendamentos");
    }
}



[HttpPost]
public async Task<ActionResult> Post([FromBody]TipoAgendamento item)
{
    try
    {
        await context.TBAgendamento.AddAsync(item);
        await context.SaveChangesAsync();
        return Ok("Agendamento Salvo com Sucesso");
    }
    catch
    {
        return BadRequest("Erro ao salvar o Agendamento informado");
    }
}


[HttpGet("{id}")]    //Obtenção do Agendamento pelo ID  Rota: /api/TipoAgendamento/1
public async Task<ActionResult<TipoAgendamento>> Get([FromRoute] int id)
{
    try
    {
        if (await context.TBAgendamento.AnyAsync(p => p.Id == id))
        {
            return Ok(await context.TBAgendamento
                .Include(p => p.TipoExame)
                .Include(p => p.TipoUserPaciente)
                .FirstOrDefaultAsync(p => p.Id == id));
        }
        else
        {
            return NotFound("O Agendamento informado não foi encontrado");
        }
    }
    catch
    {
        return BadRequest("Erro ao efetuar a busca do Agendamento");
    }
}

[HttpPut("{id}")]  // Atualização do Agendamento
public async Task<ActionResult> Put([FromRoute] int id, [FromBody] TipoAgendamento model)
{
    if (id != model.Id) //se é diferente da rota, erro
        return BadRequest("Agendamento inválido");

    try
    {
        //se não existe, erro, senão cria um novo tipo de curso
        if (!await context.TBAgendamento.AnyAsync(p => p.Id == id))
            return NotFound("Agendamento inválido");

        context.TBAgendamento.Update(model);
        await context.SaveChangesAsync();
        return Ok("Agendamento salvo com sucesso");
    }
    catch
    {
        return BadRequest("Erro ao salvar o Agendamento informado");
    }
}

[HttpDelete("{id}")]  // Ação de Remoção
public async Task<ActionResult> Delete([FromRoute] int id)
{
    try
    {
        TipoAgendamento model = await context.TBAgendamento.FindAsync(id);

        if (model == null)
            return NotFound("Agendamento inválido");

        context.TBAgendamento.Remove(model);
        await context.SaveChangesAsync();
        return Ok("Agendamento removido com sucesso");
    }
    catch
    {
        return BadRequest("Falha ao remover o Agendamento");
    }
}


[HttpGet("pesquisaNome/{nome}")]  // Pesquisa por igualdade de um atributo específico
public async Task<ActionResult<IEnumerable<TipoAgendamento>>> GetNome([FromRoute] string nome)
{
    try
    {
        List<TipoAgendamento> resultado = await context.TBAgendamento
        .Include(p => p.TipoUserPaciente)
        .Include(p => p.TipoExame)
        .Where(p => p.TipoUserPaciente.Nome == nome)
        .ToListAsync();
        return Ok(resultado);
    }
    catch (Exception ex)
    {
        return BadRequest("Falha ao buscar um Agendamento pelo Nome: {ex.Message}");
    }
}

[HttpGet("pesquisaCPF/{CPF}")]  // Pesquisa por igualdade de um atributo específico
public async Task<ActionResult<IEnumerable<TipoAgendamento>>> GetCPF([FromRoute] string CPF)
{
    try
    {
        List<TipoAgendamento> resultado = await context.TBAgendamento
        .Include(p => p.TipoUserPaciente)
        .Include(p => p.TipoExame)
        .Where(p => p.TipoUserPaciente.CPF == CPF)
        .ToListAsync();
        return Ok(resultado);
    }
    catch (Exception ex)
    {
        return BadRequest("Falha ao buscar um Agendamento pelo Nome: {ex.Message}");
    }
}




}
