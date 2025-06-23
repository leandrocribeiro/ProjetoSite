using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TipoUserSecretariaController : ControllerBase
{
    private readonly DataContext context;

    public TipoUserSecretariaController(DataContext dc)
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
    private static string ObterSenha(TipoUserSecretaria usuario)
    {
        if (usuario == null || string.IsNullOrWhiteSpace(usuario.Senha))
            throw new Exception();

        string retorno = "startcripto" + usuario.Senha.Trim();
        retorno = Hash(retorno);
        retorno = retorno + "endcripto";
        retorno = Hash(retorno);

        return retorno;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TipoUserSecretaria>>> Get()
    {
        try
        {
            return Ok(await context.TBUserSecretaria.ToListAsync());
        }
        catch
        {
            return BadRequest("Erro ao listar os Usuários Secretaria");
        }
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] TipoUserSecretaria item)
    {
        try
        {
            if (await context.TBUserSecretaria.AnyAsync(p => p.Email == item.Email))
                return BadRequest("Já existe Tipo Secretaria com o e-mail informado");

            item.Senha = ObterSenha(item);
            await context.TBUserSecretaria.AddAsync(item);
            await context.SaveChangesAsync();
            return Ok("Usuário Tipo Secretaria Salvo com Sucesso");
        }
        catch
        {
            return BadRequest("Erro ao salvar o Usuário Secretaria informado");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TipoUserSecretaria>> Get([FromRoute] int id)
    {
        try
        {
            if (await context.TBUserSecretaria.AnyAsync(p => p.Id == id))
                return Ok(await context.TBUserSecretaria.FindAsync(id));
            else
                return NotFound("O Usuário Secretaria informado não foi encontrado");
        }
        catch
        {
            return BadRequest("Erro ao efetuar a busca do Usuário Secretaria");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put([FromRoute] int id, [FromBody] TipoUserSecretaria model)
    {
        if (id != model.Id)
            return BadRequest("Usuário Secretaria inválido");

        try
        {
            if (!await context.TBUserSecretaria.AnyAsync(p => p.Id == id))
                return NotFound("Usuário Secretaria inválido");

            context.TBUserSecretaria.Update(model);
            await context.SaveChangesAsync();
            return Ok("Usuário Secretaria salvo com sucesso");
        }
        catch
        {
            return BadRequest("Erro ao salvar o Usuário Secretaria informado");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
        try
        {
            TipoUserSecretaria model = await context.TBUserSecretaria.FindAsync(id);

            if (model == null)
                return NotFound("Usuário Secretaria inválido");

            context.TBUserSecretaria.Remove(model);
            await context.SaveChangesAsync();
            return Ok("Usuário Secretaria removido com sucesso");
        }
        catch
        {
            return BadRequest("Falha ao remover o Usuário Secretaria");
        }
    }

    [HttpGet("pesquisaNome/{nome}")]
    public async Task<ActionResult<IEnumerable<TipoUserSecretaria>>> Get([FromRoute] string nome)
    {
        try
        {
            List<TipoUserSecretaria> resultado = await context.TBUserSecretaria
                .Where(p => p.Nome == nome)
                .ToListAsync();

            return Ok(resultado);
        }
        catch
        {
            return BadRequest("Falha ao buscar um Usuário Secretaria");
        }
    }

    // DTO para login
    public class SecretariaLoginDto
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }

    [HttpPost("autenticar")]
    public async Task<ActionResult<object>> Autenticar([FromBody] SecretariaLoginDto login)
    {
        if (string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Senha))
            return BadRequest("Email e senha são obrigatórios.");

        try
        {
            var tempUser = new TipoUserSecretaria { Senha = login.Senha };
            string senhaHasheada = ObterSenha(tempUser);

            var usuario = await context.TBUserSecretaria
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
                Tipo = 2 }
            });
        }
        catch
        {
            return BadRequest("Erro na autenticação.");
        }
    }
}
