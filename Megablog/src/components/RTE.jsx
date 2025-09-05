import React from 'react'
import {Editor} from '@tinymce/tinymce-react';
import {Controller} from 'react-hook-form';
import conf from '../conf/conf';

export default function RTE({name, control, label, defaultValue = ""}) {
  return (
    <div className='w-full'>
        {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
        <Controller 
  // default to the capitalized 'Content' to match the Appwrite collection schema
  name= {name || "Content"}
        control ={control}
        render= {({field: {onChange}}) => (
            <Editor
            apiKey={conf.tinymceApiKey}
            initialValue={defaultValue}
            init={{
                height: 500,
                menubar: true,
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount"
                ],
                toolbar:
                "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | code preview | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                branding: false,
                promotion: false
            }}
            onEditorChange={onChange}
            />
        )}
        />
    </div>
  )
}

