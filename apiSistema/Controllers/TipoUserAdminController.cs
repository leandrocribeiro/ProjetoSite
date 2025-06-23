using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TipoUserAdminController : ControllerBase
{
    private readonly DataContext context;

    public TipoUserAdminController(DataContext dc)
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
    private static string ObterSenha(TipoUserAdmin usuario)  // *** SEM ALTERAÇÃO ***
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
    public async Task<ActionResult<IEnumerable<TipoUserAdmin>>> Get()
    {
        try
        {
            return Ok(await context.TBUserAdmin.ToListAsync());
        }
        catch
        {
            return BadRequest("Erro ao listar os Usuários Administradores");
        }
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] TipoUserAdmin item)
    {
        try
        {
            if (await context.TBUserAdmin.AnyAsync(p => p.Email == item.Email))
                return BadRequest("Já existe Administrador com o e-mail informado");

            item.Senha = ObterSenha(item);
            await context.TBUserAdmin.AddAsync(item);
            await context.SaveChangesAsync();
            return Ok("Usuário Tipo Administrador Salvo com Sucesso");
        }
        catch
        {
            return BadRequest("Erro ao salvar o Usuário Adminstrador informado");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TipoUserAdmin>> Get([FromRoute] int id)
    {
        try
        {
            if (await context.TBUserAdmin.AnyAsync(p => p.Id == id))
                return Ok(await context.TBUserAdmin.FindAsync(id));
            else
                return NotFound("O Usuário Adminstrador informado não foi encontrado");
        }
        catch
        {
            return BadRequest("Erro ao efetuar a busca do Usuário Administrador");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put([FromRoute] int id, [FromBody] TipoUserAdmin model)
    {
        if (id != model.Id)
            return BadRequest("Usuário Administrador inválido");

        try
        {
            if (!await context.TBUserAdmin.AnyAsync(p => p.Id == id))
                return NotFound("Usuário Administrador inválido");

            context.TBUserAdmin.Update(model);
            await context.SaveChangesAsync();
            return Ok("Usuário Administrador salvo com sucesso");
        }
        catch
        {
            return BadRequest("Erro ao salvar o Usuário Admnistrador informado");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
        try
        {
            TipoUserAdmin model = await context.TBUserAdmin.FindAsync(id);

            if (model == null)
                return NotFound("Usuário Administrador inválido");

            context.TBUserAdmin.Remove(model);
            await context.SaveChangesAsync();
            return Ok("Usuário Administrador removido com sucesso");
        }
        catch
        {
            return BadRequest("Falha ao remover o Usuário Administrador");
        }
    }

    [HttpGet("pesquisaNome/{nome}")]
    public async Task<ActionResult<IEnumerable<TipoUserAdmin>>> Get([FromRoute] string nome)
    {
        try
        {
            List<TipoUserAdmin> resultado = await context.TBUserAdmin.Where(p => p.Nome == nome).ToListAsync();
            return Ok(resultado);
        }
        catch
        {
            return BadRequest("Falha ao buscar um Usuário Administrador");
        }
    }

    // DTO para login
    public class AdminLoginDto
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }

    [HttpPost("autenticar")]
    public async Task<ActionResult<object>> Autenticar([FromBody] AdminLoginDto login)
    {
        if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Senha))
            return BadRequest("Email e senha são obrigatórios.");

        try
        {
            var temp = new TipoUserAdmin { Senha = login.Senha };
            string senhaHasheada = ObterSenha(temp);

            var usuario = await context.TBUserAdmin
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
                Tipo = 1 }
            });
        }
        catch
        {
            return BadRequest("Erro na autenticação.");
        }
    }
}
