import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
interface Props {
  post: Post
}

function Post({ post }: Props) {
  console.log(post)
  return (
    <main>
      <Header />
      <img
        className="h-80 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt=""
      />

      <article className="mx-auto max-w-4xl p-5">
        <h1 className="mt-4 mb-3 font-mono text-3xl underline decoration-black decoration-2">
          {post.title}
        </h1>
        <h2 className="my-4 text-xl font-light text-gray-600">
          {post.description}
        </h2>
        <div className="mt-5 flex items-center space-x-5">
          <img
            className="h-14 w-12 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="text-lg font-extralight">
            Blog posted by{' '}
            <span className="text-xl font-bold text-green-600">
              {post.author.name}
            </span>{' '}
            - Published at {post._createdAt}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              list: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  author-> {
  name,
  image
},
 description,
 mainImage,
 slug,
 body
}`
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
