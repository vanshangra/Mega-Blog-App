import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from "react-router-dom"
import { useSelector } from 'react-redux'

function PostCard({$id, title, featuredImage}) {
  const userData = useSelector((state) => state.auth.userData);
  const target = userData ? `/post/${$id}` : '/login';

  return (
  <Link to={target}>
    <div className='w-full bg-gray-100 rounded-xl p-4 relative overflow-hidden'>
      <div className='w-full justify-center mb-4'>
        <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl w-full h-40 object-cover'/>

      </div>
      <h2 className='text-xl font-bold'>
        {title}
      </h2>

            {/* Guests should see the actual preview image and title. Clicking will still route guests to /login. */}
    </div>
  </Link>
  )
}

export default PostCard