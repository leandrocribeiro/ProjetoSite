using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TipoExameController : ControllerBase
{
  private readonly DataContext context;

    public TipoExameController(DataContext dc)
    {
        context = dc;
    }

[HttpGet]
public async Task<ActionResult<IEnumerable<TipoExame>>> Get()
{
    try
    {
        return Ok(await context.TBExame.ToListAsync());
    }
    catch
    {
        return BadRequest("Erro ao listar os Exames");
    }
}


[HttpPost]
public async Task<ActionResult> Post([FromBody]TipoExame item)
{
    try
    {
        await context.TBExame.AddAsync(item);
        await context.SaveChangesAsync();
        return Ok("Exame Salvo com Sucesso");
    }
    catch
    {
        return BadRequest("Erro ao salvar o Exame informado");
    }
}

[HttpGet("{id}")]    //Obtenção do Item pelo ID  Rota: /api/TipoExame/1
public async Task<ActionResult<TipoExame>> Get([FromRoute] int id)
{
    try
    {
        if (await context.TBExame.AnyAsync(p => p.Id == id))
            return Ok(await context.TBExame.FindAsync(id));
        else
            return NotFound("O Tipo de Exame informado não foi encontrado");
    }
    catch
    {
        return BadRequest("Erro ao efetuar a busca do Tipo de Exame");
    }
}


[HttpPut("{id}")]  // Atualização
public async Task<ActionResult> Put([FromRoute] int id, [FromBody] TipoExame model)
{
    if (id != model.Id) //se é diferente da rota, erro
        return BadRequest("Tipo de Exame inválido");

    try
    {
        //se não existe, erro, senão cria um novo tipo de exame
        if (!await context.TBExame.AnyAsync(p => p.Id == id))
            return NotFound("Tipo de Exame inválido");

        context.TBExame.Update(model);
        await context.SaveChangesAsync();
        return Ok("Tipo de Exame salvo com sucesso");
    }
    catch
    {
        return BadRequest("Erro ao salvar o tipo de Exame informado");
    }
}

[HttpDelete("{id}")]  // Ação de Remoção
public async Task<ActionResult> Delete([FromRoute] int id)
{
    try
    {
        TipoExame model = await context.TBExame.FindAsync(id);

        if (model == null)
            return NotFound("Tipo de Exame inválido");

        context.TBExame.Remove(model);
        await context.SaveChangesAsync();
        return Ok("Tipo de Exame removido com sucesso");
    }
    catch
    {
        return BadRequest("Falha ao remover o Usuário");
    }
}

[HttpGet("pesquisaNome/{nome}")]  // Pesquisa por igualdade de um atributo específico
public async Task<ActionResult<IEnumerable<TipoExame>>> Get([FromRoute] string nome)
{
    try
    {
        List<TipoExame> resultado = await context.TBExame.Where(p => p.Nome == nome).ToListAsync();
        return Ok(resultado);
    }
    catch
    {
        return BadRequest("Falha ao buscar um Tipo de Exame");
    }
}




}
