import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Bath, BedDouble, CarFront, MapPin } from 'lucide-react-native';
import StarRating from 'react-native-star-rating-widget';
import fonts from '../../config/fonts';
import colors from '../../config/colors';
import IconCard from '../iconCard/IconCard';
import { HotelFeature} from '../../constants/Accomodation';

interface Params {
  reviews: number;
  rating: number;
  rentPerDay: number;
  rentPerHour: number;
  location: string;
  title: string;
  description: string;
  features: HotelFeature[];
  numberOfBeds: number;
  numberOfBathrooms: number;
  numberOfGuests: number;
  roomType?: string;
}
const DetailsCard = ({
  reviews,
  rating,
  rentPerDay,
  rentPerHour,
  location,
  numberOfBeds,
  numberOfBathrooms,
  numberOfGuests,
  title,
  description,
  features,
  roomType,
}: Params) => {
  const roomTypeLabel = roomType
    ? String(roomType).charAt(0).toUpperCase() + String(roomType).slice(1).toLowerCase()
    : null;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {roomTypeLabel ? (
          <View style={styles.roomTypeBadge}>
            <Text style={styles.roomTypeText}>Room type: {roomTypeLabel}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.priceContainer}>
        <View>
          <Text style={styles.price}> Rent per day: ${rentPerDay}</Text>
          <Text style={styles.price}> Rent per hour: ${rentPerHour}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={12} />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        <View>
          <StarRating rating={rating} onChange={() => {}} starSize={14} />
          <Text style={styles.reviews}>{reviews} Reviews</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <BedDouble size={26} color={'#F47E26'} />
          <Text style={styles.featureItemText}>{numberOfBeds} Beds</Text>
        </View>
        <View style={styles.featureItem}>
          <Bath size={26} color={'#F47E28'} />
          <Text style={styles.featureItemText}>{numberOfBathrooms} Baths</Text>
        </View>
        <View style={styles.featureItem}>
          <CarFront size={26} color={'#F47E20'} />
          <Text style={styles.featureItemText}>{numberOfGuests} Guests</Text>
        </View>
      </View>

      <View>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text numberOfLines={5} style={styles.descriptionText}>
          {description}
        </Text>
      </View>

      <View>
        <Text style={styles.amenitiesTitle}>Amenities</Text>
        <FlatList
          data={features}
          scrollEnabled={false} // disable inner scrolling
          renderItem={({ item, index }) => {
            return <IconCard name={item.name} icon={item.image} key={index} />;
          }}
          contentContainerStyle={styles.amenitiesContainer}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default DetailsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    shadowColor: '#000000', // black color
    shadowOffset: { width: 0, height: 1 }, // 0px 1px
    shadowOpacity: 0.15, // #00000026 = 15% opacity (26 hex = ~15%)
    shadowRadius: 12, // blur radius
    elevation: 5, // for Android shadow
    padding: 20,
    paddingTop: 30,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.c_666666,
    marginHorizontal: 20,
    marginTop: 20,
  },
  descriptionTitle: { fontSize: 20, fontFamily: fonts.medium },
  amenitiesTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    lineHeight: 22,
    marginBottom: 28,
  },
  title: { fontSize: 20, fontFamily: fonts.medium, marginBottom: 6 },
  roomTypeBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.c_F3F3F3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomTypeText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  featureItemText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.c_F47E20,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenitiesContainer: {
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  reviews: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 3,
  },
  location: {
    fontSize: 12,
    textAlign: 'center',
  },
});
