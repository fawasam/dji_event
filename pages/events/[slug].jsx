import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

const SingleEvent = ({ evt }) => {
  const router = useRouter();
  console.log(evt);
  const deleteEvent = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/events");
      }
    }
  };
  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt?.id}`}>
            <a>
              {" "}
              <FaPencilAlt />
              Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
            Delete Event
          </a>
        </div>
        <span>
          {evt?.attributes.date} at {evt?.attributes.time}
        </span>
        <h1>{evt?.attributes.name}</h1>
        <ToastContainer />
        {evt?.attributes.image.data?.attributes && (
          <div className={styles.image}>
            <Image
              src={evt?.attributes.image.data?.attributes.formats.large.url}
              width={960}
              height={600}
              alt={evt?.name}
            />
          </div>
        )}
        <h3>Performers:</h3>
        <p>{evt?.attributes.performers}</p>
        <h3>Description</h3>
        <p>{evt?.attributes.description}</p>
        <h3>Venue: {evt?.attributes.venue}</h3>
        <p>{evt?.attributes.address}</p>
        <Link href="/events">
          <a className={styles.back}>{"<"} Go Back</a>
        </Link>
      </div>
    </Layout>
  );
};

export default SingleEvent;

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events`);
  const event = await res.json();
  const events = event.data;
  const paths = events.map((evt) => ({
    params: { slug: evt.attributes.slug },
  }));
  return {
    paths,
    fallback: true,
  };
}
export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(
    `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`
  );
  const event = await res.json();
  const events = event.data;
  console.log(events);
  return {
    props: {
      evt: events[0],
    },
    revalidate: 1,
  };
}
