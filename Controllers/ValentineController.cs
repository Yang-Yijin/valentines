using Microsoft.AspNetCore.Mvc;
using Valentine.Models;

namespace Valentine.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValentineController : ControllerBase
{
    [HttpGet]
    public ActionResult<ValentineContent> GetContent()
    {
        var content = new ValentineContent
        {
            GirlfriendName = "Yuxin Yang",
            Title = "我最爱最爱的老婆宝宝大人",
            LoveLetter = "见不到宝宝大人的日子好漫长 每天都度日如年 但是好在马上看到希望啦 宝宝这周四就回来啦 想了好久的宝宝终于可以手手触摸到啦 宝宝在了也能踏踏实实的睡好觉啦 情人节快乐宝宝 谢谢宝宝送我的新显示器 我简直太爱不释手啦 嘿嘿等宝宝回来好好带宝宝购物去 见不到面我总惹小宝贝不高兴 回来好好补偿一下我的小可怜 嘿嘿希望下一个情人节我们能在一起过 臭宝宝大人超级无敌宇宙爆炸爱老婆宝宝咪大人",
            RelationshipStartDate = new DateOnly(2025, 7, 19),
            SurpriseMessage = "情人节快乐宝宝 每天都是更爱你的一天",
            Signature = "Yijin Yang",
            MusicUrl = "/music/love.m4a",
            SecretMusicUrl = "/music/secret.m4a",
            Photos =
            [
                "/images/1.jpg",
                "/images/2.jpg",
                "/images/3.jpg",
                "/images/4.jpg",
                "/images/5.jpg",
                "/images/6.jpg",
                "/images/7.jpg",
                "/images/8.jpg",
                "/images/9.jpg",
                "/images/10.jpg",
                "/images/11.jpg",
                "/images/12.jpg",
                "/images/13.jpg"
            ]
        };

        return Ok(content);
    }
}
