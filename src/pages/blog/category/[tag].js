
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';


function slugTag(tag) {
    console.log(tag)
    return tag
    .replace(/([a-zA-Z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function unslugTag(tag) {
    return tag
    .split('-') // Split the string on hyphens
    .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize every word after the first
    )
    .join(''); // Join the words without any spaces
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

    return (<div className='post-infos-container'>
                {posts.map(post =>
                (
                  <div key={post.sys.id} className='post-info-container'>
                    <div className='category'>
                        <a href={`/category/${slugTag(post.metadata.tags[0].sys.id)}`} rel='tag'>
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
    )
}


export default Blog;

export async function getStaticPaths() {

    const contentful = require('contentful');

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });

    const entries = await client.getEntries({ content_type: 'blogPost' }); // Replace 'tagContentType' with your actual Contentful content type for tags.

    const tags = entries.items.map(entry => entry.metadata.tags[0].sys.id); // This assumes your tag has a field named 'name'.

    const paths = tags.map(tag => ({
        params: { tag: slugTag(tag) } // You're using the slugTag function to slugify the tag.
    }));

    return { paths, fallback: 'blocking' }; // Using 'blocking' as a fallback mode ensures a smooth user experience.
}

export async function getStaticProps({ params }) {

    const contentful = require('contentful');

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });


    // Fetch posts for the provided tag (category).
    const entries = await client.getEntries({
        content_type: 'blogPost',
        'metadata.tags.sys.id[all]': unslugTag(params.tag) // This assumes each blog post has a 'tags' field which is a reference to a tag.
    });

    return {
        props: {
            posts: entries.items,
            isBlog: true,
            notProtected: true,
        }
    };
}

