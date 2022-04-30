import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}
export default function Home({ posts }: Props) {
  console.log(posts)
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>MY Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-0 ">
        <div className="space-y-5 px-10">
          <h1 className="max-w-xl font-serif text-5xl">
            <span className="underline decoration-black decoration-4">
              Miskatur's
            </span>{' '}
            place to write, read blogs and connect
          </h1>
          <p className="text-xl underline decoration-black decoration-2">
            I Do storytellings here
          </p>
        </div>

        <img
          className="hidden h-20 md:inline-flex lg:h-60"
          src="M.png"
          alt=""
        />
      </div>
      {/* posts */}
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border-2">
              <img
                className="h-60 w-full object-cover transition-transform duration-200 group-hover:scale-110"
                src={urlFor(post.mainImage).url()}
                alt=""
              />
              <div className="flex justify-between bg-white p-5">
                <p className="font-mono text-xl font-bold">{post.title}</p>
                <p className="items-center text-xs">
                  {post.description} by {post.author.name}
                </p>
                <img
                  className="h-12 w-14 rounded-full "
                  src={urlFor(post.author.image).url()}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,
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
  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
