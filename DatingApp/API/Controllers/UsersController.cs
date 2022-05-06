using System.Security.Claims;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using API.Extensions;
using API.Helpers;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper , IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }
        [HttpGet] 
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }
            userParams.CurrnetUsername = user.UserName;
            
            var users = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(
            users.CurrentPage,
            users.PageSize,
            users.TotalCount,
            users.TotalPages);

            return Ok(users); //dibag bifore
        }

        [HttpGet("{username}", Name = "GetUser"),]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var rtn = await _userRepository.GetMemberAsync(username);
            return rtn;
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            _mapper.Map(memberUpdateDTO, user);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) 
                return NoContent();

            return BadRequest("Failed to update user");

        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var result = await _photoService.UploadPhotoAsync(file);
            if(result.Error != null){
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0){
                photo.IsMain = true;  
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            return CreatedAtRoute("GetUser" ,new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));

            return  BadRequest("Problem adding photos");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var username =  User.GetUsername(); 
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if(photo.IsMain) return BadRequest("This is already the main photo");
            var currentMain = user.Photos.FirstOrDefault(p=> p.IsMain);

            if(currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set photo to main");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return BadRequest("Photo not found");
            if (photo.IsMain) return BadRequest("You cannot delete your main photo");
            if (photo.PublicId != null) 
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);

            }
            user.Photos.Remove(photo);
            if (await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete photo");

        }

    }
}