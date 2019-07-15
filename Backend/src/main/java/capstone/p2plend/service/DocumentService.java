package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.entity.User;
import capstone.p2plend.enums.DocumentType;
import capstone.p2plend.repo.DocumentFileRepository;
import capstone.p2plend.repo.DocumentRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class DocumentService {

	@Autowired
	DocumentRepository docRepo;

	@Autowired
	DocumentFileRepository docFileRepo;

	@Autowired
	JwtService jwtService;

	@Autowired
	UserRepository userRepo;

	public boolean uploadDocument(String documentType, String token, MultipartFile[] mf) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			if (documentType == null) {
				return false;
			}
			Document iDoc = new Document();
			DocumentType dt = DocumentType.valueOf(documentType.toUpperCase());
			switch (dt) {
			case ID:
				iDoc.setDocumentType("Identity Card");
				break;
			case PP:
				iDoc.setDocumentType("Passport");
				break;
			case DL:
				iDoc.setDocumentType("Driving Licence");
				break;
			default:
				return false;
			}
			iDoc.setUser(user);
			Document savedDoc = docRepo.saveAndFlush(iDoc);

			int totalFile = mf.length;
			for (int i = 0; i < totalFile; i++) {

				String fileName = StringUtils.cleanPath(mf[i].getOriginalFilename());
//				if (fileName.contains("..")) {
//					return false;
////		                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
//				}
				DocumentFile df = new DocumentFile();
				df.setFileName(fileName);
				df.setFileType(mf[i].getContentType());
				df.setData(mf[i].getBytes());
				df.setDocument(savedDoc);
				docFileRepo.saveAndFlush(df);

			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public List<Document> getUserDocument(String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			List<Document> lstDoc = user.getDocument();
			for (Document d : lstDoc) {
				d.setUser(null);
			}
			return lstDoc;
		} catch (Exception e) {
			return null;
		}

	}

	public boolean validDocumentId(Document document) {
		try {

			if (document.getDocumentId() == null) {
				return false;
			}

			//Receive document with id and docId
			Document findDoc = docRepo.findByDocumentIdAndDocumentType(document.getDocumentId(),
					docRepo.findById(document.getId()).get().getDocumentType());
			
			if(findDoc != null) {
				return false;
			}

			Document existDoc = docRepo.findById(document.getId()).get();
			existDoc.setDocumentId(document.getDocumentId());
			docRepo.saveAndFlush(existDoc);
			
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public List<Document> getAllUnvalidDocument(){
		try {
			
			List<Document> lstDoc = docRepo.findAllNullDocument();
			for(Document d : lstDoc) {
				d.setUser(null);
			}
			
			return lstDoc;
			
		} catch (Exception e) {
			return null;
		}
	}

}
