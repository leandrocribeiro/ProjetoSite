using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TipoUserPacienteController : ControllerBase
{
    private readonly DataContext context;

    public TipoUserPacienteController(DataContext dc)
    {
        context = dc;
    }

    [NonAction]
    private static string Hash(string password)
    {
        HashAlgorithm hasher = HashAlgorithm.Create(HashAlgorithmName.SHA512.Name);
        byte[] stringBytes = Encoding.ASCII.GetBytes(password);
        byte[] byteArray = hasher.ComputeHash(stringBytes);

        StringBuilder stringBuilder = new StringBuilder();
        foreach (byte b in byteArray)
        {
            stringBuilder.AppendFormat("{0:x2}", b);
        }

        return stringBuilder.ToString();
    }

    [NonAction]
    private static string ObterSenha(TipoUserPaciente usuario)
    {
        if (usuario == null || usuario.Senha == null || usuario.Senha.Trim() == "")
            throw new Exception();

        string retorno = usuario.Senha;

        retorno = "startcripto" + retorno;
        retorno = Hash(retorno);
        retorno = retorno + "endcripto";
        retorno = Hash(retorno);

        return retorno;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TipoUserPaciente>>> Get()
    {
        try
        {
            return Ok(await context.TBUserPaciente.ToListAsync());
        }
        catch
        {
            return BadRequest("Erro ao listar os Usuários Tipo Paciente");
        }
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] TipoUserPaciente item)
    {
        try
        {
            if (await context.TBUserPaciente.AnyAsync(p => p.Email == item.Email))
                return BadRequest("Já existe Paciente com o e-mail informado");

            item.Senha = ObterSenha(item);
            await context.TBUserPaciente.AddAsync(item);
            await context.SaveChangesAsync();
            return Ok("Usuário Tipo Paciente Salvo com Sucesso");
        }
        catch
        {
            return BadRequest("Erro ao salvar o Usuário Tipo Paciente informado");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TipoUserPaciente>> Get([FromRoute] int id)
    {
        try
        {
            if (await context.TBUserPaciente.AnyAsync(p => p.Id == id))
                return Ok(await context.TBUserPaciente.FindAsync(id));
            else
                return NotFound("O Usuário Tipo Paciente informado não foi encontrado");
        }
        catch
        {
            return BadRequest("Erro ao efetuar a busca do Usuário Tipo Paciente");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put([FromRoute] int id, [FromBody] TipoUserPaciente model)
    {
        if (id != model.Id)
            return BadRequest("Usuário Tipo Paciente inválido");

        try
        {
            if (!await context.TBUserPaciente.AnyAsync(p => p.Id == id))
                return NotFound("Usuário Tipo Paciente inválido");

            context.TBUserPaciente.Update(model);
            await context.SaveChangesAsync();
            return Ok("Usuário Tipo Paciente salvo com sucesso");
        }
        catch
        {
            return BadRequest("Erro ao salvar o Usuário Tipo Paciente informado");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
        try
        {
            TipoUserPaciente model = await context.TBUserPaciente.FindAsync(id);

            if (model == null)
                return NotFound("Usuário Tipo Paciente inválido");

            context.TBUserPaciente.Remove(model);
            await context.SaveChangesAsync();
            return Ok("Usuário Tipo Paciente removido com sucesso");
        }
        catch
        {
            return BadRequest("Falha ao remover o Usuário Tipo Paciente");
        }
    }

    [HttpGet("pesquisaNome/{nome}")]
    public async Task<ActionResult<IEnumerable<TipoUserPaciente>>> Get([FromRoute] string nome)
    {
        try
        {
            List<TipoUserPaciente> resultado = await context.TBUserPaciente
                .Where(p => p.Nome == nome)
                .ToListAsync();

            return Ok(resultado);
        }
        catch
        {
            return BadRequest("Falha ao buscar um Usuário Tipo Paciente");
        }
    }

    // DTO para login
    public class PacienteLoginDto
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }

    [HttpPost("autenticar")]
    public async Task<ActionResult<object>> Autenticar([FromBody] PacienteLoginDto login)
    {
        if (string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Senha))
            return BadRequest("Email e senha são obrigatórios.");

        try
        {
            var tempUser = new TipoUserPaciente { Senha = login.Senha };
            string senhaHasheada = ObterSenha(tempUser);

            var usuario = await context.TBUserPaciente
                .FirstOrDefaultAsync(u => u.Email.ToLower() == login.Email.ToLower()
                                        && u.Senha == senhaHasheada);

            if (usuario == null)
                return Unauthorized("Email ou senha inválidos.");

             return Ok(new
            {
                success = true,
                usuario = new { 
                usuario.Id,
                usuario.Nome,
                usuario.Email,
                Tipo = 3 }
            });
        }
        catch
        {
            return BadRequest("Erro na autenticação.");
        }
    }
}
