// Firestore security rules for the wedding planner app
// Copy these rules to your Firebase console

rules_version = "2"
\
service cloud.firestore
{
  match / databases / { database } / documents
  // Allow users to read and write their own wedding data
  match / weddings / { userId }
  allow
  read, write
  :
  if request.auth != null && request.auth.uid == userId;

  // Allow read access to shared weddings
  allow
  if exists(/databases/$(database)/documents/weddingShares/{shareId}) 
                  && get(/databases/$(database)/documents/weddingShares/{shareId}).data.weddingId == userId;

  // Allow access to subcollections for the wedding owner
  match / { subcollection } / { docId }
  allow
  read, write
  :
  if request.auth != null && request.auth.uid == userId;

  // Allow read access to subcollections for shared weddings
  allow
  if exists(/databases/$(database)/documents/weddingShares/{shareId}) 
                    && get(/databases/$(database)/documents/weddingShares/{shareId}).data.weddingId == userId;

  // Allow users to create and manage their wedding shares
  match / weddingShares / { shareId }
  allow
  if request.auth != null && request.resource.data.createdBy == request.auth.uid;
  allow
  if true; // Anyone can read a share to check if it's valid
  allow
  update, delete
  :
  if request.auth != null && resource.data.createdBy == request.auth.uid;
}

