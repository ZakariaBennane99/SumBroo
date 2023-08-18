const contentful = require('contentful');

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header'
import Footer from '../../../components/Footer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';



function slugTag(tag) {
    return tag
    .replace(/([a-zA-Z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function camelToWords(str) {
    return str
        // Insert a space before all capital letters
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' '); // Split the string into an array of words
}

function readingTime(st) {
    const wordCount = st.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200)
    const readingTimeInMin = readTime + ' Min Read'
    return readingTimeInMin
}

function formatDate(inputDate) {

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    
    const date = new Date(inputDate);
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;

}
  

function Blog({ posts }) {

    return (
        <div className='blog-parent-section'>
            <Header />
            <div className='post-infos-container'>
                {posts.map(post =>
                (
                  <div key={post.sys.id} className='post-info-container'>
                    <div className='category'>
                        <a href={`blog/category/${slugTag(post.metadata.tags[0].sys.id)}`} rel='tag'>
                            {camelToWords(post.metadata.tags[0].sys.id).join(' ').toUpperCase()}</a>
                    </div>
                    <h2>
                        <a href={`/blog/${post.fields.slug}`} title={post.fields.title}>{post.fields.title}</a>
                    </h2>

                    <a href={`/blog/${post.fields.slug}`} title={post.fields.title} className='featured-image'>
                        <img src={`/api/contentfulAsset?path=${encodeURIComponent(post.fields.featuredImage.fields.file.url)}`} alt={post.fields.featuredImage.fields.title} />
                    </a>

                    <div className='excerpt'>
                        {post.fields.excerpt}
                    </div>

                    <div className='post-meta-info'>
                        <span className='author'>
                            <img src={`/api/contentfulAsset?path=${encodeURIComponent(post.fields.author.fields.photo.fields.file.url)}`} alt={post.fields.author.fields.photo.fields.title} />
                            <span>{post.fields.author.fields.name}</span>
                        </span>
                        <span className='date'>{formatDate(post.fields.publishedDate)}</span>
                        <span className='reading-time'>{readingTime(documentToPlainTextString(post.fields.body))}</span>
                    </div>
                    
                  </div>
                ))}
            </div>
            <Footer />
        </div>
    )
}


export default Blog;

export async function getStaticProps() {

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });

    const entries = await client.getEntries({ content_type: 'blogPost' }); 
    return {
      props: {
        posts: entries.items
      }
    };
}